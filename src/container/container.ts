import { UserRepository } from "../repos/UserRepository";
import { EventRepository } from "../repos/EventRepository";
import { RegistrationRepository } from "../repos/RegistrationRepository";
import { QueryRepository } from "../repos/QueryRepository";
import { AuthService } from "../services/AuthService";
import { EventService } from "../services/EventService";
import { RegistrationService } from "../services/RegistrationService";
import { QueryService } from "../services/QueryService";
import { AuthController } from "../controllers/AuthController";
import { EventController } from "../controllers/EventController";
import { RegistrationController } from "../controllers/RegistrationController";
import { QueryController } from "../controllers/QueryController";
import { AppContainer } from "../dto/AppContainerDTO";

let container: AppContainer | null = null;

export const getContainer = (): AppContainer => {
  if (container) return container;

  // Repositories
  const userRepo = new UserRepository();
  const eventRepo = new EventRepository();
  const registrationRepo = new RegistrationRepository();
  const queryRepo = new QueryRepository();

  // Services
  const authService = new AuthService(userRepo);
  const eventService = new EventService(eventRepo);
  const registrationService = new RegistrationService(
    registrationRepo,
    eventRepo,
  );
  const queryService = new QueryService(queryRepo);

  // Controllers
  const authController = new AuthController(authService);
  const eventController = new EventController(eventService);
  const registrationController = new RegistrationController(
    registrationService,
  );
  const queryController = new QueryController(queryService);

  container = {
    authController,
    eventController,
    registrationController,
    queryController,
  };

  return container;
};
