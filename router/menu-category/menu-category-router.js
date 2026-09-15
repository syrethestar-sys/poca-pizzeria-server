import express from "express";
import { createMenuCategoryController } from "../../controller/menu-category/create-menu-category.js";
import { getMenuCategoryController } from "../../controller/menu-category/get-menu-category.js";
import { updateMenuCategoryController } from "../../controller/menu-category/update-menu-category.js";
import { deleteMenuCategoryController } from "../../controller/menu-category/del-menu-category.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", requireAdmin, createMenuCategoryController);
router.get("/get", getMenuCategoryController);
router.put("/update", requireAdmin, updateMenuCategoryController);
router.delete("/delete", requireAdmin, deleteMenuCategoryController);

export default router;
