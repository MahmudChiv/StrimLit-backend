import { prisma } from "../lib/prisma.ts";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import passport from "../config/passport.ts";
import type { CreateGoogleUserDto } from "./auth.dto.ts";
import dotenv from "dotenv";
dotenv.config();

export async function findOrCreateGoogleUser(dto: CreateGoogleUserDto) {
  try {
    let user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: dto.email || "",
          firstName: dto.firstName || "",
          lastName: dto.lastName || "",
          avatar: dto.avatar || "",
          googleId: dto.googleId || "",
          provider: "google",
        },
      });
    }

    return user;
  } catch (error) {
    console.log("Error in auth service: ", error);
    throw error;
  }
}

export const getGoogleCallback = async (req: Request, res: Response) => {
  console.log("Code reached here")
  const user = req.user as any;
  const token = generateToken(user.id, user.email);
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/app`);
};

export const fail = (req: Request, res: Response) => {
  res.status(401).json({ message: "Google authentication failed" });
};

export const getMe = async (req: Request, res: Response) => {
  console.log("Code reached here in getMe")
  const currentUser = JSON.stringify(req.user);
  console.log(`User from getMe: ${currentUser}`);
  if (!currentUser) {
    console.log("No user found in request");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const me = await prisma.user.findUnique({
      where: { id: JSON.parse(currentUser).sub },
    });
    console.log(`Me from getMe: ${JSON.stringify(me)}`);

    return res.status(200).json({ me });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
};

export const generateToken = (userId: string, email: string) => {
  return jwt.sign({ sub: userId, email }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
