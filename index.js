import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./connectDB.js";
import authRouter from "./router/auth/auth.js";
import menuCategoryRouter from "./router/menu-category/menu-category-router.js";
import menuItemRouter from "./router/menu-item/menu-item-router.js";
import orderRouter from "./router/order/order-router.js";

const app = express();

const PORT = process.env.PORT ?? 1000;

// Wire webhook signatures are computed over the exact raw bytes, so the
// parser stashes them before JSON-decoding the body.
app.use(express.json({ verify: (request, response, buf) => { request.rawBody = buf; } }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean),
  }),
);

app.use(async (request, response, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log(err);
    response.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (request, response) => {
  response.json({ status: "ok", service: "poca-server" });
});

app.use("/auth", authRouter);
app.use("/menu-category", menuCategoryRouter);
app.use("/menu-item", menuItemRouter);
app.use("/order", orderRouter);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`server is running, on port ${PORT}`);
  });
}

export default app;
