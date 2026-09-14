import mongoose from "mongoose";
import { localizedString, localizedSubSchema } from "./localized.js";

// Wine is sold by the glass and the bottle, so an item may carry
// several priced variants instead of one flat price.
const priceVariantSchema = new mongoose.Schema(
  {
    label: { type: localizedSubSchema, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const menuItemSchema = new mongoose.Schema(
  {
    name: localizedString(true),
    description: localizedString(false),
    // Base price in tögrög. Ignored when variants are present.
    price: { type: Number, min: 0 },
    variants: { type: [priceVariantSchema], default: [] },
    image: { type: String, default: "" },
    // 🌶 spicy · 🌿 vegetarian · ⚪ white (no tomato)
    tags: [{ type: String, enum: ["spicy", "extra-spicy", "vegetarian", "white"] }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

menuItemSchema.pre("validate", function validatePricing(next) {
  if (this.price == null && this.variants.length === 0) {
    return next(new Error("An item needs either a price or at least one variant"));
  }
  next();
});

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
