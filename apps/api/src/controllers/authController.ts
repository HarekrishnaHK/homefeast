import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import { AppError } from "../middleware/errorHandler";

const REFRESH_COOKIE = "hf_refresh_token";
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(15).optional(),
  password: z.string().min(8).max(72),
  role: z.enum(["CUSTOMER", "COOK"]).default("CUSTOMER"),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function issueTokensAndRespond(
  res: Response,
  user: { id: string; role: "CUSTOMER" | "COOK" | "ADMIN" }
) {
  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
  return accessToken;
}

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      city: data.city,
    },
  });

  // If registering as a cook, create the pending HomeCook profile shell
  if (data.role === "COOK") {
    await prisma.homeCook.create({
      data: {
        userId: user.id,
        businessName: `${data.name}'s Kitchen`,
        slug: `${data.name.toLowerCase().replace(/\s+/g, "-")}-${user.id.slice(-6)}`,
        city: data.city ?? "Unspecified",
        deliveryStart: "11:00",
        deliveryEnd: "14:00",
      },
    });
  }

  const accessToken = await issueTokensAndRespond(res, user);

  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) throw new AppError("Invalid email or password", 401);

  if (!user.isActive) throw new AppError("This account has been deactivated", 403);

  const accessToken = await issueTokensAndRespond(res, user);

  return res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw new AppError("No refresh token provided", 401);

  let decoded: { userId: string };
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new AppError("Refresh token is no longer valid", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new AppError("User not found", 401);

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  return res.json({ accessToken });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }
  res.clearCookie(REFRESH_COOKIE);
  return res.status(204).send();
}
