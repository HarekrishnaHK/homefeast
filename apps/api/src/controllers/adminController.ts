import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

// GET /api/admin/stats — KPI dashboard
export async function getDashboardStats(_req: AuthedRequest, res: Response) {
  const [
    totalUsers,
    totalCooks,
    activeSubscriptions,
    totalComplaintsOpen,
    revenueAgg,
    ordersThisMonth,
    pendingCooks,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.homeCook.count({ where: { status: "APPROVED" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.complaint.count({ where: { status: "OPEN" } }),
    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
      _sum: { amount: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
    }),
    prisma.homeCook.count({ where: { status: "PENDING" } }),
  ]);

  return res.json({
    data: {
      totalUsers,
      totalCooks,
      activeSubscriptions,
      openComplaints: totalComplaintsOpen,
      monthlyRevenue: revenueAgg._sum.amount ?? 0,
      ordersThisMonth,
      pendingCookApprovals: pendingCooks,
    },
  });
}

// GET /api/admin/cooks?status=PENDING
export async function listCooksForAdmin(req: AuthedRequest, res: Response) {
  const status = req.query.status as string | undefined;
  const cooks = await prisma.homeCook.findMany({
    where: status ? { status: status as any } : undefined,
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: cooks });
}

const decisionSchema = z.object({
  reason: z.string().max(500).optional(),
});

// PATCH /api/admin/cooks/:id/approve
export async function approveCook(req: AuthedRequest, res: Response) {
  const cook = await prisma.homeCook.findUnique({ where: { id: req.params.id } });
  if (!cook) throw new AppError("Cook not found", 404);

  const updated = await prisma.homeCook.update({
    where: { id: cook.id },
    data: { status: "APPROVED", approvedAt: new Date(), approvedById: req.user!.userId },
  });

  await prisma.notification.create({
    data: {
      userId: cook.userId,
      type: "COOK_APPROVAL",
      title: "You're approved!",
      message: "Your HomeFeast cook profile has been approved. You can now publish menus.",
    },
  });

  return res.json({ data: updated });
}

// PATCH /api/admin/cooks/:id/reject
export async function rejectCook(req: AuthedRequest, res: Response) {
  const { reason } = decisionSchema.parse(req.body);
  const cook = await prisma.homeCook.findUnique({ where: { id: req.params.id } });
  if (!cook) throw new AppError("Cook not found", 404);

  const updated = await prisma.homeCook.update({
    where: { id: cook.id },
    data: { status: "REJECTED", rejectedReason: reason },
  });

  await prisma.notification.create({
    data: {
      userId: cook.userId,
      type: "COOK_APPROVAL",
      title: "Application update",
      message: reason
        ? `Your cook application was not approved: ${reason}`
        : "Your cook application was not approved.",
    },
  });

  return res.json({ data: updated });
}

// GET /api/admin/users
export async function listUsers(req: AuthedRequest, res: Response) {
  const role = req.query.role as string | undefined;
  const users = await prisma.user.findMany({
    where: role ? { role: role as any } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      city: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: users });
}

// PATCH /api/admin/users/:id/toggle-active
export async function toggleUserActive(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new AppError("User not found", 404);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isActive: !user.isActive },
  });
  return res.json({ data: updated });
}

const taxonomySchema = z.object({
  name: z.string().min(2).max(100),
});

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

// POST /api/admin/categories
export async function createCategory(req: AuthedRequest, res: Response) {
  const { name } = taxonomySchema.parse(req.body);
  const category = await prisma.category.create({ data: { name, slug: slugify(name) } });
  return res.status(201).json({ data: category });
}

// POST /api/admin/cuisines
export async function createCuisine(req: AuthedRequest, res: Response) {
  const { name } = taxonomySchema.parse(req.body);
  const cuisine = await prisma.cuisine.create({ data: { name, slug: slugify(name) } });
  return res.status(201).json({ data: cuisine });
}

// GET /api/admin/complaints
export async function listComplaints(req: AuthedRequest, res: Response) {
  const status = req.query.status as string | undefined;
  const complaints = await prisma.complaint.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      cook: { select: { businessName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: complaints });
}

const resolveSchema = z.object({
  status: z.enum(["IN_PROGRESS", "RESOLVED", "CLOSED"]),
  resolution: z.string().max(1000).optional(),
});

// PATCH /api/admin/complaints/:id
export async function updateComplaint(req: AuthedRequest, res: Response) {
  const data = resolveSchema.parse(req.body);
  const complaint = await prisma.complaint.findUnique({ where: { id: req.params.id } });
  if (!complaint) throw new AppError("Complaint not found", 404);

  const updated = await prisma.complaint.update({
    where: { id: complaint.id },
    data,
  });
  return res.json({ data: updated });
}
