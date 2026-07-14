import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../middleware/errorHandler";
import { login, logout, refresh, register } from "../controllers/authController";

const router = Router();

// Stricter limiter on auth endpoints to slow down credential stuffing / brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));

export default router;
