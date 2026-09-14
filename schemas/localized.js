import mongoose from "mongoose";

// Every customer-facing string on the menu exists in both languages.
// EN is required; MN falls back to EN in the client when it is empty.
export const localizedString = (required = false) => ({
  en: { type: String, required, trim: true },
  mn: { type: String, default: "", trim: true },
});

export const localizedSubSchema = new mongoose.Schema(
  { en: { type: String, required: true, trim: true }, mn: { type: String, default: "", trim: true } },
  { _id: false },
);
