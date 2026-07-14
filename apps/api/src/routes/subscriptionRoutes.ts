import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  cancelSubscription,
  createSubscription,
  listMySubscriptions,
  renewSubscription,
} from "../controllers/subscriptionController";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listMySubscriptions));
router.post("/", requireRole("CUSTOMER"), asyncHandler(createSubscription));
router.patch("/:id/renew", requireRole("CUSTOMER"), asyncHandler(renewSubscription));
router.patch("/:id/cancel", requireRole("CUSTOMER"), asyncHandler(cancelSubscription));

export default router;
