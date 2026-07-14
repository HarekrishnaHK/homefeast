import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

const reviewSchema = z.object({
  cookId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

async function recalculateCookRating(cookId: string) {
  const agg = await prisma.review.aggregate({
    where: { cookId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.homeCook.update({
    where: { id: cookId },
    data: {
      avgRating: agg._avg.rating ?? 0,
      totalReviews: agg._count.rating,
    },
  });
}

// POST /api/reviews
export async function addReview(req: AuthedRequest, res: Response) {
  const data = reviewSchema.parse(req.body);

  const review = await prisma.review.create({
    data: {
      customerId: req.user!.userId,
      cookId: data.cookId,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
    },
  });

  await recalculateCookRating(data.cookId);
  return res.status(201).json({ data: review });
}

const updateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

// PUT /api/reviews/:id
export async function updateReview(req: AuthedRequest, res: Response) {
  const review = await prisma.review.findFirst({
    where: { id: req.params.id, customerId: req.user!.userId },
  });
  if (!review) throw new AppError("Review not found", 404);

  const data = updateSchema.parse(req.body);
  const updated = await prisma.review.update({ where: { id: review.id }, data });

  await recalculateCookRating(review.cookId);
  return res.json({ data: updated });
}
