import express from "express";
import {
  loginController,
  signUpController,
  forgotPasswordController,
  resetPasswordController,
  meController,
} from "../../controller/auth/auth.js";
import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/sign-up", signUpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// Who am I, according to the database?
router.get("/me", requireAuth, meController);

export default router;
