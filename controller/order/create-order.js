import mongoose from "mongoose";
import { Order } from "../../schemas/order.js";
import { MenuItem } from "../../schemas/menu-item.js";
import { wire, toMinorUnits } from "../../lib/wire.js";

const extractCheckoutUrl = (nextAction) =>
  nextAction?.redirect_to_url?.url ??
  nextAction?.hosted_url ??
  nextAction?.checkout_url ??
  nextAction?.qr_code?.url ??
  null;

// The client sends item ids and quantities; prices are re-read from the
// database so a tampered cart cannot set its own total.
export const createOrderController = async (request, response) => {
  try {
    const { lines, type, customer, user } = request.body ?? {};

    if (!Array.isArray(lines) || lines.length === 0) {
      return response.status(400).json({ message: "The order has no items" });
    }
    if (!customer?.name || !customer?.phone) {
      return response.status(400).json({ message: "A name and phone number are required" });
    }
    if (type === "delivery" && !customer?.address) {
      return response.status(400).json({ message: "A delivery address is required" });
    }

    const ids = lines.map((l) => l.item);
    if (ids.some((id) => !mongoose.isValidObjectId(id))) {
      return response.status(400).json({ message: "Invalid item id in the order" });
    }

    const items = await MenuItem.find({ _id: { $in: ids } });
    const byId = new Map(items.map((i) => [String(i._id), i]));

    const priced = [];
    for (const line of lines) {
      const item = byId.get(String(line.item));
      if (!item) {
        return response.status(400).json({ message: "An item in the order no longer exists" });
      }
      if (!item.available) {
        return response.status(409).json({ message: `${item.name.en} is not available right now` });
      }

      const variant = line.variantLabel
        ? item.variants.find((v) => v.label.en === line.variantLabel)
        : null;
      if (line.variantLabel && !variant) {
        return response.status(400).json({ message: "That option is no longer offered" });
      }

      const quantity = Number(line.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return response.status(400).json({ message: "Invalid quantity" });
      }

      priced.push({
        item: item._id,
        name: item.name.en,
        image: item.image ?? "",
        variantLabel: variant ? variant.label.en : "",
        price: variant ? variant.price : item.price,
        quantity,
      });
    }

    const total = priced.reduce((sum, l) => sum + l.price * l.quantity, 0);

    const order = await Order.create({
      user: mongoose.isValidObjectId(user) ? user : undefined,
      lines: priced,
      total,
      type: type ?? "delivery",
      customer,
    });

    try {
      const intent = await wire.paymentIntents.create({
        amount: toMinorUnits(total),
        currency: "MNT",
        automatic_operator: true,
        metadata: { orderId: String(order._id) },
      });
      const confirmed = await wire.paymentIntents.confirm(intent.id, {
        return_url: `${process.env.FRONTEND_URL}/orders`,
      });
      const checkoutUrl = extractCheckoutUrl(confirmed.next_action);

      if (!checkoutUrl) {
        throw new Error("Wire did not return a checkout link");
      }

      order.payment = { provider: "wire", intentId: confirmed.id, checkoutUrl, status: "pending" };
      await order.save();
    } catch (paymentErr) {
      await Order.findByIdAndDelete(order._id);
      console.error("Wire payment setup failed:", paymentErr);
      return response
        .status(502)
        .json({ message: "Could not start payment. Please try again." });
    }

    response.status(201).json({ message: "Order placed", order });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err.message ?? err });
  }
};
