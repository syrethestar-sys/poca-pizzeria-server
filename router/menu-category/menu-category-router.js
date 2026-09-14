import express from "express";
import { createMenuCategoryController } from "../../controller/menu-category/create-menu-category.js";
import { getMenuCategoryController } from "../../controller/menu-category/get-menu-category.js";
import { updateMenuCategoryController } from "../../controller/menu-category/update-menu-category.js";
import { deleteMenuCategoryController } from "../../controller/menu-category/del-menu-category.js";

const router = express.Router();

router.post("/create", createMenuCategoryController);
router.get("/get", getMenuCategoryController);
router.put("/update", updateMenuCategoryController);
router.delete("/delete", deleteMenuCategoryController);

export default router;
