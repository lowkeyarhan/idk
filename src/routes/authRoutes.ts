import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authLimiter } from "../middleware/rateLimiters";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "../validators/authValidator";

export const buildAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post(
    "/register",
    authLimiter,
    validateRequest(registerSchema),
    asyncHandler(controller.register),
  );
  router.post(
    "/login",
    authLimiter,
    validateRequest(loginSchema),
    asyncHandler(controller.login),
  );

  return router;
};
