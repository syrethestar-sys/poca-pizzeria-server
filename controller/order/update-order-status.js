import mongoose from "mongoose";
import { Order, ORDER_STATUSES } from "../../schemas/order.js";

export const updateOrderStatusController = async (request, response) => {
  try {
    const { id, status } = request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid order id" });
    }
    if (!ORDER_STATUSES.includes(status)) {
      return response.status(400).json({ message: "Unknown order status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return response.status(404).json({ message: "Order does not exist" });
    }

    response.status(200).json({ message: "Order updated", order });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
