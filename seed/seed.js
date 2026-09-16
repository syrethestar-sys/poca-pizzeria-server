// Loads the printed menu into MongoDB and creates the first admin user.
//   npm run seed            → adds anything missing, leaves existing rows alone
//   npm run seed -- --fresh → wipes the menu collections first
//
// Admin credentials come from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { connectDB } from "../connectDB.js";
import { MenuCategory } from "../schemas/menu-category.js";
import { MenuItem } from "../schemas/menu-item.js";
import { User } from "../schemas/user-schema.js";
import { categories, items } from "./menu-data.js";

const fresh = process.argv.includes("--fresh");

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Copy .env.example to .env first.");
    process.exit(1);
  }

  await connectDB();
  console.log("connected");

  if (fresh) {
    await MenuItem.deleteMany({});
    await MenuCategory.deleteMany({});
    console.log("cleared the menu collections");
  }

  const idByKey = new Map();

  for (const category of categories) {
    const saved = await MenuCategory.findOneAndUpdate(
      { "name.en": category.name.en },
      { name: category.name, kind: category.kind, order: category.order, image: category.image },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    idByKey.set(category.key, saved._id);
  }
  console.log(`categories: ${categories.length}`);

  let written = 0;
  for (const [index, item] of items.entries()) {
    const categoryId = idByKey.get(item.category);
    if (!categoryId) {
      console.warn(`skipped "${item.name.en}" — unknown category "${item.category}"`);
      continue;
    }

    await MenuItem.findOneAndUpdate(
      { "name.en": item.name.en, category: categoryId },
      {
        name: item.name,
        description: item.description ?? { en: "", mn: "" },
        price: item.price,
        variants: item.variants ?? [],
        tags: item.tags ?? [],
        category: categoryId,
        available: true,
        order: index,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    written += 1;
  }
  console.log(`menu items: ${written}`);

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log(`admin ${adminEmail} already exists — left untouched`);
    } else {
      await User.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: "Poca admin",
        role: "admin",
      });
      console.log(`admin created: ${adminEmail}`);
    }
  } else {
    console.log("no SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD set — skipped the admin user");
  }

  await mongoose.connection.close();
  console.log("done");
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});
