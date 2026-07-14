import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  approveCook,
  createCategory,
  createCuisine,
  getDashboardStats,
  listComplaints,
  listCooksForAdmin,
  listUsers,
  rejectCook,
  toggleUserActive,
  updateComplaint,
} from "../controllers/adminController";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/stats", asyncHandler(getDashboardStats));

router.get("/cooks", asyncHandler(listCooksForAdmin));
router.patch("/cooks/:id/approve", asyncHandler(approveCook));
router.patch("/cooks/:id/reject", asyncHandler(rejectCook));

router.get("/users", asyncHandler(listUsers));
router.patch("/users/:id/toggle-active", asyncHandler(toggleUserActive));

router.post("/categories", asyncHandler(createCategory));
router.post("/cuisines", asyncHandler(createCuisine));

router.get("/complaints", asyncHandler(listComplaints));
router.patch("/complaints/:id", asyncHandler(updateComplaint));

export default router;
