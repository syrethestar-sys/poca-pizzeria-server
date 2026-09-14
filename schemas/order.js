import mongoose from "mongoose";

// Line items store the name and price as they were at checkout, so an
// order stays readable after the menu changes.
const orderLineSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    variantLabel: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "ready",
  "on-the-way",
  "delivered",
  "cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lines: { type: [orderLineSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      phone2: { type: String, default: "", trim: true },
      // Street-level address as chosen from the map.
      address: { type: String, default: "", trim: true },
      addressType: { type: String, enum: ["home", "office"], default: "home" },
      // The part no map can supply: which entrance, which floor, which door.
      entrance: { type: String, default: "", trim: true },
      floor: { type: String, default: "", trim: true },
      apartment: { type: String, default: "", trim: true },
      addressNote: { type: String, default: "", trim: true },
      note: { type: String, default: "", trim: true },
      lat: { type: Number },
      lon: { type: Number },
    },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
