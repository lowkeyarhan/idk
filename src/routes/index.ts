import { Router } from "express";
import { AppContainer } from "../container/container";
import { buildAuthRoutes } from "./authRoutes";
import { buildEventRoutes } from "./eventRoutes";
import { buildQueryRoutes } from "./queryRoutes";
import { buildRegistrationRoutes } from "./registrationRoutes";

export const buildApiRouter = (container: AppContainer): Router => {
  const router = Router();

  router.use("/auth", buildAuthRoutes(container.authController));
  router.use("/events", buildEventRoutes(container.eventController));
  router.use(
    "/registrations",
    buildRegistrationRoutes(container.registrationController),
  );
  router.use("/queries", buildQueryRoutes(container.queryController));

  return router;
};
