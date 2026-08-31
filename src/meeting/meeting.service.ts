import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.ts";

export const createMeeting = async (req: Request, res: Response) => {
  const meetingId = uuidv4();

  try {
    const meeting = await prisma.meeting.create({
      data: {
        id: meetingId,
        hostId: req.user?.sub || "",
        createdAt: new Date(),
      },
    });

    return res.status(201).json({
        meetingId: meeting.id,
        meetingUrl: `${process.env.FRONTEND_URL}/meeting/room/${meeting.id}`
    })
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
