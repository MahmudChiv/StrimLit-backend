import { Router } from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { createMeeting } from "./meeting.service.ts";

const router = Router();

router.post("/create", protect, createMeeting);

export default router;
