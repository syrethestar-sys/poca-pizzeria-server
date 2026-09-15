import express from "express";
import {
  loginController,
  signUpController,
  forgotPasswordController,
  resetPasswordController,
} from "../../controller/auth/auth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/sign-up", signUpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
