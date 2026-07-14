import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { addReview, updateReview } from "../controllers/reviewController";

const router = Router();

router.use(requireAuth, requireRole("CUSTOMER"));

router.post("/", asyncHandler(addReview));
router.put("/:id", asyncHandler(updateReview));

export default router;
