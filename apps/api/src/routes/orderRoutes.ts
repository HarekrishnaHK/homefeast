import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  cancelOrder,
  createOrder,
  listMyOrders,
  updateOrderStatus,
} from "../controllers/orderController";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listMyOrders));
router.post("/", requireRole("CUSTOMER"), asyncHandler(createOrder));
router.patch("/:id/status", requireRole("COOK"), asyncHandler(updateOrderStatus));
router.patch("/:id/cancel", requireRole("CUSTOMER"), asyncHandler(cancelOrder));

export default router;
