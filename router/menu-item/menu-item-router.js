import express from "express";
import { createMenuItemController } from "../../controller/menu-item/create-menu-item.js";
import { listMenuItemController } from "../../controller/menu-item/list-menu-item.js";
import { getMenuItemController } from "../../controller/menu-item/get-menu-item.js";
import { updateMenuItemController } from "../../controller/menu-item/update-menu-item.js";
import { deleteMenuItemController } from "../../controller/menu-item/del-menu-item.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", requireAdmin, createMenuItemController);
router.get("/get", listMenuItemController);
router.get("/get/:id", getMenuItemController);
router.put("/update", requireAdmin, updateMenuItemController);
router.delete("/delete", requireAdmin, deleteMenuItemController);

export default router;
