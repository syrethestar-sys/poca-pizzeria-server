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

// Behind Vercel every request arrives from a proxy. One hop is what Vercel
// adds; without this, req.ip is the proxy rather than the caller.
app.set("trust proxy", 1);

// Wire webhook signatures are computed over the exact raw bytes, so the
// parser stashes them before JSON-decoding the body.
// 100kb is far more than any order or menu item needs, and refuses an
// oversized body before it is parsed.
app.use(
  express.json({
    limit: "100kb",
    verify: (request, response, buf) => {
      request.rawBody = buf;
    },
  }),
);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean),
  }),
);

// Flood protection lives in the Vercel firewall, not here. Counting requests
// in this process only ever counts one instance's share of the traffic, so the
// limit it enforces is a fraction of the real one — and the counters grow in
// memory while the flood is happening. The edge refuses the request before
// this function is invoked at all.

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
