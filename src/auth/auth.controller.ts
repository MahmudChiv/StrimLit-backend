import { Router } from "express";
import type { Request } from "express";
import passport from "../config/passport.ts";
import {
  getGoogleCallback,
  fail,
  getMe,
  logout,
} from "./auth.service.ts";
import { protect } from "../middleware/auth.middleware.ts";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/fail" }),
  getGoogleCallback,
);
router.get("/fail", fail);
router.get("/me", protect, getMe);
router.get("/logout", logout);

export default router;
