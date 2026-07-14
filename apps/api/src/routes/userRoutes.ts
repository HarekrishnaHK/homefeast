import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import {
  addFavorite,
  getMe,
  listFavorites,
  removeFavorite,
  updateMe,
} from "../controllers/userController";

const router = Router();

router.use(requireAuth);

router.get("/me", asyncHandler(getMe));
router.put("/me", asyncHandler(updateMe));
router.get("/me/favorites", asyncHandler(listFavorites));
router.post("/me/favorites/:cookId", asyncHandler(addFavorite));
router.delete("/me/favorites/:cookId", asyncHandler(removeFavorite));

export default router;
