import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

// GET /api/users/me
export async function getMe(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      city: true,
      createdAt: true,
      addresses: true,
    },
  });
  return res.json({ data: user });
}

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(15).optional(),
  city: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// PUT /api/users/me
export async function updateMe(req: AuthedRequest, res: Response) {
  const data = updateSchema.parse(req.body);
  const updated = await prisma.user.update({
    where: { id: req.user!.userId },
    data,
  });
  return res.json({ data: updated });
}

// GET /api/users/me/favorites
export async function listFavorites(req: AuthedRequest, res: Response) {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.userId },
    include: { cook: true },
  });
  return res.json({ data: favorites });
}

// POST /api/users/me/favorites/:cookId
export async function addFavorite(req: AuthedRequest, res: Response) {
  const favorite = await prisma.favorite.upsert({
    where: {
      userId_cookId: { userId: req.user!.userId, cookId: req.params.cookId },
    },
    create: { userId: req.user!.userId, cookId: req.params.cookId },
    update: {},
  });
  return res.status(201).json({ data: favorite });
}

// DELETE /api/users/me/favorites/:cookId
export async function removeFavorite(req: AuthedRequest, res: Response) {
  await prisma.favorite.deleteMany({
    where: { userId: req.user!.userId, cookId: req.params.cookId },
  });
  return res.status(204).send();
}
