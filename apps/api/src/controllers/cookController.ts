import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

// GET /api/cooks — public browse with filters
const listQuerySchema = z.object({
  city: z.string().optional(),
  cuisine: z.string().optional(),
  foodType: z.enum(["VEG", "NON_VEG", "EGG", "VEGAN"]).optional(),
  planType: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export async function listCooks(req: Request, res: Response) {
  const query = listQuerySchema.parse(req.query);
  const { page, limit } = query;

  const where: any = { status: "APPROVED" };
  if (query.city) where.city = { equals: query.city, mode: "insensitive" };
  if (query.foodType) where.foodType = { has: query.foodType };
  if (query.cuisine) where.cuisines = { some: { slug: query.cuisine } };
  if (query.q) {
    where.OR = [
      { businessName: { contains: query.q, mode: "insensitive" } },
      { bio: { contains: query.q, mode: "insensitive" } },
    ];
  }
  if (query.planType || query.minPrice || query.maxPrice) {
    where.menus = {
      some: {
        isActive: true,
        ...(query.planType ? { planType: query.planType } : {}),
        ...(query.minPrice || query.maxPrice
          ? {
              price: {
                ...(query.minPrice ? { gte: query.minPrice } : {}),
                ...(query.maxPrice ? { lte: query.maxPrice } : {}),
              },
            }
          : {}),
      },
    };
  }

  const [cooks, total] = await Promise.all([
    prisma.homeCook.findMany({
      where,
      include: {
        cuisines: true,
        menus: { where: { isActive: true }, take: 3 },
      },
      orderBy: [{ avgRating: "desc" }, { totalOrders: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.homeCook.count({ where }),
  ]);

  return res.json({
    data: cooks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// GET /api/cooks/:slug — public provider detail
export async function getCookBySlug(req: Request, res: Response) {
  const cook = await prisma.homeCook.findUnique({
    where: { slug: req.params.slug },
    include: {
      cuisines: true,
      categories: true,
      menus: { where: { isActive: true }, include: { items: true } },
      reviews: {
        include: { customer: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!cook || cook.status !== "APPROVED") {
    throw new AppError("Provider not found", 404);
  }
  return res.json({ data: cook });
}

// POST /api/cooks — cook completes/updates their own profile (registration request)
const upsertProfileSchema = z.object({
  businessName: z.string().min(2).max(150),
  bio: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().optional(),
  city: z.string().min(2),
  serviceAreas: z.array(z.string()).default([]),
  foodType: z.array(z.enum(["VEG", "NON_VEG", "EGG", "VEGAN"])).default([]),
  cuisineSlugs: z.array(z.string()).default([]),
  deliveryStart: z.string(),
  deliveryEnd: z.string(),
  fssaiLicenseNo: z.string().optional(),
});

export async function updateOwnProfile(req: AuthedRequest, res: Response) {
  const data = upsertProfileSchema.parse(req.body);
  const cook = await prisma.homeCook.findUnique({ where: { userId: req.user!.userId } });
  if (!cook) throw new AppError("Cook profile not found", 404);

  const updated = await prisma.homeCook.update({
    where: { id: cook.id },
    data: {
      businessName: data.businessName,
      bio: data.bio,
      coverImageUrl: data.coverImageUrl,
      city: data.city,
      serviceAreas: data.serviceAreas,
      foodType: data.foodType,
      deliveryStart: data.deliveryStart,
      deliveryEnd: data.deliveryEnd,
      fssaiLicenseNo: data.fssaiLicenseNo,
      cuisines: { set: data.cuisineSlugs.map((slug) => ({ slug })) },
      // Re-submitting profile edits while pending keeps status as-is;
      // approved cooks editing key details could optionally be re-reviewed.
    },
    include: { cuisines: true },
  });

  return res.json({ data: updated });
}

// GET /api/cooks/me — cook's own dashboard summary
export async function getOwnProfile(req: AuthedRequest, res: Response) {
  const cook = await prisma.homeCook.findUnique({
    where: { userId: req.user!.userId },
    include: { cuisines: true, menus: true },
  });
  if (!cook) throw new AppError("Cook profile not found", 404);
  return res.json({ data: cook });
}
