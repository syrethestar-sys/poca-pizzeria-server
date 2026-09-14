import mongoose from "mongoose";
import { MenuItem } from "../../schemas/menu-item.js";
import { MenuCategory } from "../../schemas/menu-category.js";

export const createMenuItemController = async (request, response) => {
  try {
    const { name, description, price, variants, image, tags, category, available, order } =
      request.body ?? {};

    if (!mongoose.isValidObjectId(category)) {
      return response.status(400).json({ message: "Invalid category id" });
    }

    const categoryExists = await MenuCategory.findById(category);
    if (!categoryExists) {
      return response.status(400).json({ message: "Category does not exist" });
    }

    const menuItem = await MenuItem.create({
      name: { en: name?.en, mn: name?.mn ?? "" },
      description: { en: description?.en ?? "", mn: description?.mn ?? "" },
      price,
      variants: variants ?? [],
      image: image ?? "",
      tags: tags ?? [],
      category,
      available: available ?? true,
      order: order ?? 0,
    });

    const populated = await menuItem.populate("category", "name kind");

    response.status(201).json({ message: "Menu item created", menuItem: populated });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err.message ?? err });
  }
};
