// Sets only the round tile image on each menu category.
//   node seed/set-category-images.js
//
// Deliberately narrower than seed.js: that script also rewrites the name,
// description, price, variants, tags and order of every menu item from
// menu-data.js. This one touches nothing but the nine category images.
//
// It used to carry a stronger warning — seed.js also forced available:true and
// so un-hid anything marked sold out. That is fixed; seed.js now only sets
// `available` on rows it creates.

import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../connectDB.js";
import { MenuCategory } from "../schemas/menu-category.js";
import { categories } from "./menu-data.js";

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Copy .env.example to .env first.");
    process.exit(1);
  }

  await connectDB();
  console.log("connected");

  let updated = 0;
  let missing = 0;

  for (const category of categories) {
    if (!category.image) continue;

    const result = await MenuCategory.updateOne(
      { "name.en": category.name.en },
      { $set: { image: category.image } },
    );

    if (result.matchedCount === 0) {
      console.warn(`no category named "${category.name.en}" — skipped`);
      missing += 1;
    } else {
      console.log(`${category.name.en} → ${category.image}`);
      updated += 1;
    }
  }

  console.log(`\nupdated ${updated} categories${missing ? `, ${missing} not found` : ""}`);
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
