import mongoose from "mongoose";
import { MenuItem } from "../../schemas/menu-item.js";

export const deleteMenuItemController = async (request, response) => {
  try {
    const { id } = request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid item id" });
    }

    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return response.status(404).json({ message: "Item does not exist" });
    }

    response.status(200).json({ message: "Menu item deleted", deletedItem });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
