import express from "express";
import { meController } from "../../controller/auth/auth.js";
import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

// Who am I, according to the database? Clerk owns sign-in, sign-up and
// password reset now, so this is all that is left of the auth router — the one
// question Clerk cannot answer.
router.get("/me", requireAuth, meController);

export default router;
