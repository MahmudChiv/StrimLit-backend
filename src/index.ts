import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.controller.ts";
import meetingRoutes from "./meeting/meeting.controller.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/meeting", meetingRoutes);

app.get("/", (_req, res) => {
  res.send("StrimLit backend is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
