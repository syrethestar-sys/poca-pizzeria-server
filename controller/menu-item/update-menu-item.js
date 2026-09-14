import mongoose from "mongoose";
import { MenuItem } from "../../schemas/menu-item.js";
import { MenuCategory } from "../../schemas/menu-category.js";

export const updateMenuItemController = async (request, response) => {
  try {
    const { id, name, description, price, variants, image, tags, category, available, order } =
      request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({ message: "Invalid item id" });
    }

    if (category !== undefined) {
      if (!mongoose.isValidObjectId(category)) {
        return response.status(400).json({ message: "Invalid category id" });
      }
      const categoryExists = await MenuCategory.findById(category);
      if (!categoryExists) {
        return response.status(400).json({ message: "Category does not exist" });
      }
    }

    const updates = {};
    if (name?.en !== undefined) updates["name.en"] = name.en;
    if (name?.mn !== undefined) updates["name.mn"] = name.mn;
    if (description?.en !== undefined) updates["description.en"] = description.en;
    if (description?.mn !== undefined) updates["description.mn"] = description.mn;
    if (price !== undefined) updates.price = price;
    if (variants !== undefined) updates.variants = variants;
    if (image !== undefined) updates.image = image;
    if (tags !== undefined) updates.tags = tags;
    if (category !== undefined) updates.category = category;
    if (available !== undefined) updates.available = available;
    if (order !== undefined) updates.order = order;

    const menuItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true }).populate(
      "category",
      "name kind",
    );

    if (!menuItem) {
      return response.status(404).json({ message: "Item does not exist" });
    }

    response.status(200).json({ message: "Menu item updated", menuItem });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
