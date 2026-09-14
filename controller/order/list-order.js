import mongoose from "mongoose";
import { Order } from "../../schemas/order.js";

export const listOrderController = async (request, response) => {
  try {
    const { user, status } = request.query;

    const filter = {};
    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        return response.status(400).json({ message: "Invalid user id" });
      }
      filter.user = user;
    }
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    response.status(200).json({ message: "Orders found", orders });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
