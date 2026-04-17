import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createEventSchema,
  listEventsSchema,
  updateEventSchema,
} from "../validators/eventValidator";

export const buildEventRoutes = (controller: EventController): Router => {
  const router = Router();

  router.get(
    "/",
    validateRequest(listEventsSchema),
    asyncHandler(controller.listEvents),
  );
  router.get(
    "/summary/categories",
    asyncHandler(controller.getCategorySummary),
  );
  router.get("/:eventId", asyncHandler(controller.getEventById));

  router.post(
    "/",
    authenticate,
    authorize("admin", "organizer"),
    validateRequest(createEventSchema),
    asyncHandler(controller.createEvent),
  );

  router.patch(
    "/:eventId",
    authenticate,
    authorize("admin", "organizer"),
    validateRequest(updateEventSchema),
    asyncHandler(controller.updateEvent),
  );

  router.delete(
    "/:eventId",
    authenticate,
    authorize("admin", "organizer"),
    asyncHandler(controller.deleteEvent),
  );

  return router;
};
