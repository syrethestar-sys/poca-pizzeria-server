import { MenuCategory } from "../../schemas/menu-category.js";

export const getMenuCategoryController = async (request, response) => {
  try {
    const { kind } = request.query;
    const filter = kind ? { kind } : {};

    const menuCategories = await MenuCategory.find(filter).sort({ order: 1, createdAt: 1 });

    response.status(200).json({ message: "Menu categories found", menuCategories });
  } catch (err) {
    response.status(500).json({ message: "Internal server error", error: err });
  }
};
