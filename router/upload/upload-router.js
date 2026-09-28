import express from "express";
import { signUploadController } from "../../controller/upload/sign-upload.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.post("/sign", requireAdmin, signUploadController);

export default router;
