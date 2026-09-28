import mongoose from "mongoose";
import { Order } from "../../schemas/order.js";
import { refreshPayment } from "../../lib/payments.js";

const RECHECK_WINDOW_MS = 24 * 60 * 60 * 1000;

export const listOrderController = async (request, response) => {
  try {
    const { user, status } = request.query;

    const filter = {};
    if (request.user.role === "admin") {
      if (user) {
        if (!mongoose.isValidObjectId(user)) {
          return response.status(400).json({ message: "Invalid user id" });
        }
        filter.user = user;
      }
    } else {
      // Non-admins can only ever see their own orders, regardless of what
      // user id they pass in the query string.
      filter.user = request.user.id;
    }
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    // Catch up on payments whose webhook was missed (e.g. while the server
    // slept). Only recent pending orders, so the list stays quick.
    const since = Date.now() - RECHECK_WINDOW_MS;
    await Promise.all(
      orders
        .filter((o) => o.payment?.status === "pending" && o.createdAt?.getTime() > since)
        .slice(0, 10)
        .map(refreshPayment),
    );

    response.status(200).json({ message: "Orders found", orders });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
