import express from "express";
import { createOrderController } from "../../controller/order/create-order.js";
import { listOrderController } from "../../controller/order/list-order.js";
import { updateOrderStatusController } from "../../controller/order/update-order-status.js";

const router = express.Router();

router.post("/create", createOrderController);
router.get("/get", listOrderController);
router.put("/status", updateOrderStatusController);

export default router;
