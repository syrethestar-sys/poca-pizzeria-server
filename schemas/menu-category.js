import mongoose from "mongoose";
import { localizedString } from "./localized.js";

const menuCategorySchema = new mongoose.Schema(
  {
    name: localizedString(true),
    // Shown in the round category picker on the menu. Optional — the client
    // falls back to an icon chosen from the category name.
    image: { type: String, default: "" },
    // "food" and "drink" drive the two tabs on the menu page.
    kind: { type: String, enum: ["food", "drink"], default: "food" },
    // Lower numbers sort first. Starters before pizza, pizza before sides.
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);
