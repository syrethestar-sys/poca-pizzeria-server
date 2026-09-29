import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Clerk owns the credentials; this record owns everything else. Orders
    // point at _id, so that stays the identity the rest of the app joins on
    // and this is only the bridge back to the session. Deliberately no
    // default: a sparse index skips absent fields but would happily index a
    // column of nulls and then reject the second one.
    clerkId: { type: String, unique: true, sparse: true, trim: true },

    name: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
