import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

async function getOwnCookId(userId: string) {
  const cook = await prisma.homeCook.findUnique({ where: { userId } });
  if (!cook) throw new AppError("Cook profile not found", 404);
  return cook.id;
}

const menuSchema = z.object({
  name: z.string().min(2).max(150),
  planType: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  price: z.number().positive(),
});

const menuItemSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  foodType: z.enum(["VEG", "NON_VEG", "EGG", "VEGAN"]),
  cuisineId: z.string().optional(),
  price: z.number().nonnegative(),
});

// GET /api/menus — list the authenticated cook's menus
export async function listOwnMenus(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menus = await prisma.menu.findMany({
    where: { cookId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: menus });
}

// POST /api/menus
export async function createMenu(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const data = menuSchema.parse(req.body);
  const menu = await prisma.menu.create({ data: { ...data, cookId } });
  return res.status(201).json({ data: menu });
}

// PUT /api/menus/:id
export async function updateMenu(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menu = await prisma.menu.findFirst({ where: { id: req.params.id, cookId } });
  if (!menu) throw new AppError("Menu not found", 404);

  const data = menuSchema.partial().parse(req.body);
  const updated = await prisma.menu.update({ where: { id: menu.id }, data });
  return res.json({ data: updated });
}

// DELETE /api/menus/:id
export async function deleteMenu(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menu = await prisma.menu.findFirst({ where: { id: req.params.id, cookId } });
  if (!menu) throw new AppError("Menu not found", 404);

  await prisma.menu.delete({ where: { id: menu.id } });
  return res.status(204).send();
}

// POST /api/menus/:id/items
export async function addMenuItem(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menu = await prisma.menu.findFirst({ where: { id: req.params.id, cookId } });
  if (!menu) throw new AppError("Menu not found", 404);

  const data = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.create({ data: { ...data, menuId: menu.id } });
  return res.status(201).json({ data: item });
}

// PUT /api/menus/:menuId/items/:itemId
export async function updateMenuItem(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menu = await prisma.menu.findFirst({ where: { id: req.params.menuId, cookId } });
  if (!menu) throw new AppError("Menu not found", 404);

  const item = await prisma.menuItem.findFirst({
    where: { id: req.params.itemId, menuId: menu.id },
  });
  if (!item) throw new AppError("Menu item not found", 404);

  const data = menuItemSchema.partial().parse(req.body);
  const updated = await prisma.menuItem.update({ where: { id: item.id }, data });
  return res.json({ data: updated });
}

// DELETE /api/menus/:menuId/items/:itemId
export async function deleteMenuItem(req: AuthedRequest, res: Response) {
  const cookId = await getOwnCookId(req.user!.userId);
  const menu = await prisma.menu.findFirst({ where: { id: req.params.menuId, cookId } });
  if (!menu) throw new AppError("Menu not found", 404);

  const item = await prisma.menuItem.findFirst({
    where: { id: req.params.itemId, menuId: menu.id },
  });
  if (!item) throw new AppError("Menu item not found", 404);

  await prisma.menuItem.delete({ where: { id: item.id } });
  return res.status(204).send();
}
