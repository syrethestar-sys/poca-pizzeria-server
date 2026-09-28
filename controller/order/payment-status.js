import mongoose from "mongoose";
import { Order } from "../../schemas/order.js";
import { refreshPayment } from "../../lib/payments.js";

// Where Wire sends the customer back to (/orders?order=<id>). Works without
// logging in, so it answers with the payment state and total only — never the
// customer's name, phone or address.
export const paymentStatusController = async (request, response) => {
  try {
    const { id } = request.query;
    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return response.status(404).json({ message: "Order does not exist" });
    }

    await refreshPayment(order);

    response.status(200).json({
      order: {
        _id: order._id,
        total: order.total,
        status: order.status,
        paymentStatus: order.payment?.status ?? "pending",
        checkoutUrl: order.payment?.status === "pending" ? order.payment?.checkoutUrl : null,
      },
    });
  } catch (err) {
    console.error("Payment status failed:", err);
    response.status(500).json({ message: "Internal server error" });
  }
};
