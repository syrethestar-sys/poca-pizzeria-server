import { MenuCategory } from "../../schemas/menu-category.js";

export const createMenuCategoryController = async (request, response) => {
  try {
    const { name, kind, order, image } = request.body ?? {};

    if (!name?.en) {
      return response.status(400).json({ message: "An English category name is required" });
    }

    const exists = await MenuCategory.findOne({ "name.en": name.en });
    if (exists) {
      return response.status(409).json({ message: "That category already exists" });
    }

    const menuCategory = await MenuCategory.create({
      name: { en: name.en, mn: name.mn ?? "" },
      kind: kind ?? "food",
      order: order ?? 0,
      image: image ?? "",
    });

    response.status(201).json({ message: "Menu category created", menuCategory });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
