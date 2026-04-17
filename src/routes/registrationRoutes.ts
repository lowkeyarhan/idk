import { Router } from "express";
import { RegistrationController } from "../controllers/RegistrationController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { studentIdUpload } from "../middleware/uploadMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { createRegistrationSchema } from "../validators/registrationValidator";

export const buildRegistrationRoutes = (
  controller: RegistrationController,
): Router => {
  const router = Router();

  router.post(
    "/",
    authenticate,
    studentIdUpload.single("studentIdDocument"),
    validateRequest(createRegistrationSchema),
    asyncHandler(controller.createRegistration),
  );

  router.get("/me", authenticate, asyncHandler(controller.getMyRegistrations));
  router.get(
    "/event/:eventId",
    authenticate,
    authorize("admin", "organizer", "faculty"),
    asyncHandler(controller.getRegistrationsByEvent),
  );

  return router;
};
