import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

function planDurationDays(planType: "DAILY" | "WEEKLY" | "MONTHLY") {
  return { DAILY: 1, WEEKLY: 7, MONTHLY: 30 }[planType];
}

const createSchema = z.object({
  cookId: z.string(),
  menuId: z.string(),
  startDate: z.string().datetime(),
});

// POST /api/subscriptions
export async function createSubscription(req: AuthedRequest, res: Response) {
  const data = createSchema.parse(req.body);
  const menu = await prisma.menu.findFirst({
    where: { id: data.menuId, cookId: data.cookId, isActive: true },
  });
  if (!menu) throw new AppError("Menu not found", 404);

  const startDate = new Date(data.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + planDurationDays(menu.planType));

  const subscription = await prisma.subscription.create({
    data: {
      customerId: req.user!.userId,
      cookId: data.cookId,
      menuId: data.menuId,
      planType: menu.planType,
      startDate,
      endDate,
    },
  });

  return res.status(201).json({ data: subscription });
}

// GET /api/subscriptions
export async function listMySubscriptions(req: AuthedRequest, res: Response) {
  const { role, userId } = req.user!;

  if (role === "CUSTOMER") {
    const subs = await prisma.subscription.findMany({
      where: { customerId: userId },
      include: { cook: true, menu: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: subs });
  }

  if (role === "COOK") {
    const cook = await prisma.homeCook.findUnique({ where: { userId } });
    if (!cook) throw new AppError("Cook profile not found", 404);
    const subs = await prisma.subscription.findMany({
      where: { cookId: cook.id },
      include: { customer: { select: { name: true, phone: true } }, menu: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: subs });
  }

  throw new AppError("Not authorized", 403);
}

// PATCH /api/subscriptions/:id/renew
export async function renewSubscription(req: AuthedRequest, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { id: req.params.id, customerId: req.user!.userId },
    include: { menu: true },
  });
  if (!sub) throw new AppError("Subscription not found", 404);

  const newEnd = new Date(sub.endDate);
  newEnd.setDate(newEnd.getDate() + planDurationDays(sub.planType));

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: { endDate: newEnd, status: "ACTIVE" },
  });
  return res.json({ data: updated });
}

// PATCH /api/subscriptions/:id/cancel
export async function cancelSubscription(req: AuthedRequest, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { id: req.params.id, customerId: req.user!.userId },
  });
  if (!sub) throw new AppError("Subscription not found", 404);

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "CANCELLED", autoRenew: false },
  });
  return res.json({ data: updated });
}
