import mongoose from "mongoose";
import { MenuItem } from "../../schemas/menu-item.js";

export const getMenuItemController = async (request, response) => {
  try {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid item id" });
    }

    const menuItem = await MenuItem.findById(id).populate("category", "name kind");

    if (!menuItem) {
      return response.status(404).json({ message: "Item does not exist" });
    }

    response.status(200).json({ message: "Menu item found", menuItem });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
