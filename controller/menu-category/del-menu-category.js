import mongoose from "mongoose";
import { MenuCategory } from "../../schemas/menu-category.js";
import { MenuItem } from "../../schemas/menu-item.js";

export const deleteMenuCategoryController = async (request, response) => {
  try {
    const { id } = request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid category id" });
    }

    // Refuse rather than silently orphan the dishes inside it.
    const itemCount = await MenuItem.countDocuments({ category: id });
    if (itemCount > 0) {
      return response.status(409).json({
        message: `That category still holds ${itemCount} item(s). Move or delete them first.`,
      });
    }

    const deletedCategory = await MenuCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return response.status(404).json({ message: "Category does not exist" });
    }

    response.status(200).json({ message: "Menu category deleted", deletedCategory });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
