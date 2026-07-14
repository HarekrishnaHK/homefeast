import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  addMenuItem,
  createMenu,
  deleteMenu,
  deleteMenuItem,
  listOwnMenus,
  updateMenu,
  updateMenuItem,
} from "../controllers/menuController";

const router = Router();

router.use(requireAuth, requireRole("COOK"));

router.get("/", asyncHandler(listOwnMenus));
router.post("/", asyncHandler(createMenu));
router.put("/:id", asyncHandler(updateMenu));
router.delete("/:id", asyncHandler(deleteMenu));

router.post("/:id/items", asyncHandler(addMenuItem));
router.put("/:menuId/items/:itemId", asyncHandler(updateMenuItem));
router.delete("/:menuId/items/:itemId", asyncHandler(deleteMenuItem));

export default router;
