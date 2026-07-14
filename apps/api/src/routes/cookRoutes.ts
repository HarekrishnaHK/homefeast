import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  getCookBySlug,
  getOwnProfile,
  listCooks,
  updateOwnProfile,
} from "../controllers/cookController";

const router = Router();

// Public
router.get("/", asyncHandler(listCooks));
router.get("/me", requireAuth, requireRole("COOK"), asyncHandler(getOwnProfile));
router.get("/:slug", asyncHandler(getCookBySlug));

// Cook-only
router.put(
  "/me",
  requireAuth,
  requireRole("COOK"),
  asyncHandler(updateOwnProfile)
);

export default router;
