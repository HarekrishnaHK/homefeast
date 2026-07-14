import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

const createOrderSchema = z.object({
  cookId: z.string(),
  addressId: z.string().optional(),
  deliveryDate: z.string().datetime(),
  notes: z.string().max(500).optional(),
  items: z
    .array(z.object({ menuId: z.string(), quantity: z.number().int().positive() }))
    .min(1),
});

// POST /api/orders — customer places an order
export async function createOrder(req: AuthedRequest, res: Response) {
  const data = createOrderSchema.parse(req.body);

  const menus = await prisma.menu.findMany({
    where: { id: { in: data.items.map((i) => i.menuId) }, cookId: data.cookId, isActive: true },
  });
  if (menus.length !== data.items.length) {
    throw new AppError("One or more menu items are unavailable", 400);
  }

  const totalAmount = data.items.reduce((sum, item) => {
    const menu = menus.find((m) => m.id === item.menuId)!;
    return sum + Number(menu.price) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      customerId: req.user!.userId,
      cookId: data.cookId,
      addressId: data.addressId,
      deliveryDate: new Date(data.deliveryDate),
      notes: data.notes,
      totalAmount,
      items: {
        create: data.items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          price: menus.find((m) => m.id === item.menuId)!.price,
        })),
      },
    },
    include: { items: true },
  });

  await prisma.notification.create({
    data: {
      userId: (await prisma.homeCook.findUniqueOrThrow({ where: { id: data.cookId } })).userId,
      type: "ORDER",
      title: "New order received",
      message: `You have a new order (#${order.id.slice(-6)}) for ${order.deliveryDate.toDateString()}.`,
      link: `/dashboard/cook/orders/${order.id}`,
    },
  });

  return res.status(201).json({ data: order });
}

// GET /api/orders — list orders for the current user (customer sees own, cook sees theirs)
export async function listMyOrders(req: AuthedRequest, res: Response) {
  const { role, userId } = req.user!;

  if (role === "CUSTOMER") {
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { menu: true } }, cook: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: orders });
  }

  if (role === "COOK") {
    const cook = await prisma.homeCook.findUnique({ where: { userId } });
    if (!cook) throw new AppError("Cook profile not found", 404);
    const orders = await prisma.order.findMany({
      where: { cookId: cook.id },
      include: { items: { include: { menu: true } }, customer: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: orders });
  }

  throw new AppError("Not authorized", 403);
}

const statusSchema = z.object({
  status: z.enum([
    "ACCEPTED",
    "REJECTED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ]),
});

// PATCH /api/orders/:id/status — cook accepts/rejects/updates order status
export async function updateOrderStatus(req: AuthedRequest, res: Response) {
  const cook = await prisma.homeCook.findUnique({ where: { userId: req.user!.userId } });
  if (!cook) throw new AppError("Cook profile not found", 404);

  const order = await prisma.order.findFirst({ where: { id: req.params.id, cookId: cook.id } });
  if (!order) throw new AppError("Order not found", 404);

  const { status } = statusSchema.parse(req.body);
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status } });

  await prisma.notification.create({
    data: {
      userId: order.customerId,
      type: "ORDER",
      title: "Order update",
      message: `Your order #${order.id.slice(-6)} is now "${status.replace(/_/g, " ").toLowerCase()}".`,
      link: `/dashboard/customer/orders/${order.id}`,
    },
  });

  return res.json({ data: updated });
}

// PATCH /api/orders/:id/cancel — customer cancels their own order (only while PLACED)
export async function cancelOrder(req: AuthedRequest, res: Response) {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, customerId: req.user!.userId },
  });
  if (!order) throw new AppError("Order not found", 404);
  if (order.status !== "PLACED") {
    throw new AppError("Only orders that haven't been accepted yet can be cancelled", 400);
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: "CANCELLED" },
  });
  return res.json({ data: updated });
}
