import mongoose from "mongoose";
import { MenuCategory } from "../../schemas/menu-category.js";

export const updateMenuCategoryController = async (request, response) => {
  try {
    const { id, name, kind, order, image } = request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid category id" });
    }

    const updates = {};
    if (name?.en !== undefined) updates["name.en"] = name.en;
    if (name?.mn !== undefined) updates["name.mn"] = name.mn;
    if (kind !== undefined) updates.kind = kind;
    if (order !== undefined) updates.order = order;
    if (image !== undefined) updates.image = image;

    const menuCategory = await MenuCategory.findByIdAndUpdate(id, updates, { new: true });

    if (!menuCategory) {
      return response.status(404).json({ message: "Category does not exist" });
    }

    response.status(200).json({ message: "Menu category updated", menuCategory });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
