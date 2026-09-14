import mongoose from "mongoose";
import { MenuItem } from "../../schemas/menu-item.js";

export const listMenuItemController = async (request, response) => {
  try {
    const { category, available } = request.query;

    if (category && !mongoose.isValidObjectId(category)) {
      return response.status(400).json({ message: "Invalid category id" });
    }

    const filter = {};
    if (category) filter.category = category;
    if (available === "true") filter.available = true;

    const menuItems = await MenuItem.find(filter)
      .populate("category", "name kind order")
      .sort({ order: 1, createdAt: 1 });

    response.status(200).json({ message: "Menu items found", menuItems });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
