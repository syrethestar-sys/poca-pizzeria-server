import mongoose from "mongoose";
import { Order } from "../../schemas/order.js";
import { normalizeMnPhone } from "../../lib/phone.js";
import { refreshPayment } from "../../lib/payments.js";

// What a guest may see of an order: enough to follow it, nothing that
// identifies them beyond what they already typed in (no address, no name).
const publicView = (order) => ({
  _id: order._id,
  createdAt: order.createdAt,
  type: order.type,
  status: order.status,
  total: order.total,
  lines: order.lines.map(({ name, variantLabel, price, quantity, image }) => ({
    name,
    variantLabel,
    price,
    quantity,
    image,
  })),
  payment: {
    status: order.payment?.status ?? "pending",
    checkoutUrl: order.payment?.status === "pending" ? order.payment?.checkoutUrl : null,
  },
});

// Guest orders: the browser remembers {id, phone} for each order it placed
// and asks for them here. Both must match — an order id alone is not enough.
// POST so the phone numbers stay out of URLs and server logs.
export const trackOrdersController = async (request, response) => {
  try {
    const requested = Array.isArray(request.body?.orders) ? request.body.orders.slice(0, 20) : [];

    const valid = requested
      .map((o) => ({ id: o?.id, phone: normalizeMnPhone(o?.phone) }))
      .filter((o) => mongoose.isValidObjectId(o.id) && o.phone);

    const orders = await Order.find({ _id: { $in: valid.map((o) => o.id) } }).sort({ createdAt: -1 });
    const phoneById = new Map(valid.map((o) => [String(o.id), o.phone]));
    const matched = orders.filter((o) => normalizeMnPhone(o.customer?.phone) === phoneById.get(String(o._id)));

    await Promise.all(matched.filter((o) => o.payment?.status === "pending").map(refreshPayment));

    response.status(200).json({ orders: matched.map(publicView) });
  } catch (err) {
    console.error("Track orders failed:", err);
    response.status(500).json({ message: "Internal server error" });
  }
};

// After a guest signs in, their browser hands over the orders it remembers so
// they join the account. Only orders with no owner yet and a matching phone.
export const claimOrdersController = async (request, response) => {
  try {
    const requested = Array.isArray(request.body?.orders) ? request.body.orders.slice(0, 20) : [];
    let claimed = 0;

    for (const o of requested) {
      const phone = normalizeMnPhone(o?.phone);
      if (!phone || !mongoose.isValidObjectId(o?.id)) continue;
      const result = await Order.updateOne(
        { _id: o.id, "customer.phone": phone, $or: [{ user: null }, { user: { $exists: false } }] },
        { $set: { user: request.user.id } },
      );
      claimed += result.modifiedCount ?? 0;
    }

    response.status(200).json({ claimed });
  } catch (err) {
    console.error("Claim orders failed:", err);
    response.status(500).json({ message: "Internal server error" });
  }
};
