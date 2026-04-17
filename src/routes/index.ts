import { Router } from "express";
import { AppContainer } from "../dto/AppContainerDTO";

export const buildApiRouter = (container: AppContainer): Router => {
  const router = Router();

  router.post("/auth/register", (req, res) =>
    container.authController.register(req, res),
  );
  router.post("/auth/login", (req, res) =>
    container.authController.login(req, res),
  );

  router.get("/events", (req, res) =>
    container.eventController.listEvents(req, res),
  );

  return router;
};
