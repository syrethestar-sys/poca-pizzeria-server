import express from "express";
import { createOrderController } from "../../controller/order/create-order.js";
import { listOrderController } from "../../controller/order/list-order.js";
import { updateOrderStatusController } from "../../controller/order/update-order-status.js";
import { wireWebhookController } from "../../controller/order/wire-webhook.js";
import { paymentStatusController } from "../../controller/order/payment-status.js";
import { trackOrdersController, claimOrdersController } from "../../controller/order/track-order.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", createOrderController);
router.get("/get", requireAuth, listOrderController);
router.put("/status", requireAdmin, updateOrderStatusController);
router.get("/payment", paymentStatusController);
router.post("/track", trackOrdersController);
router.post("/claim", requireAuth, claimOrdersController);
router.post("/webhook/wire", wireWebhookController);

export default router;
