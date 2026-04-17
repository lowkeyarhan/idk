import { Router } from "express";
import { QueryController } from "../controllers/QueryController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { queryLimiter } from "../middleware/rateLimiters";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createQuerySchema,
  listQueriesSchema,
  respondQuerySchema,
} from "../validators/queryValidator";

export const buildQueryRoutes = (controller: QueryController): Router => {
  const router = Router();

  router.get("/faq", asyncHandler(controller.getFaq));
  router.post(
    "/",
    queryLimiter,
    validateRequest(createQuerySchema),
    asyncHandler(controller.createQuery),
  );

  router.get(
    "/",
    authenticate,
    authorize("admin", "organizer", "faculty"),
    validateRequest(listQueriesSchema),
    asyncHandler(controller.listQueries),
  );

  router.patch(
    "/:queryId/respond",
    authenticate,
    authorize("admin", "organizer", "faculty"),
    validateRequest(respondQuerySchema),
    asyncHandler(controller.respondToQuery),
  );

  return router;
};
