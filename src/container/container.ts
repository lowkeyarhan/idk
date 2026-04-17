import { AuthController } from "../controllers/AuthController";
import { EventController } from "../controllers/EventController";
import { QueryController } from "../controllers/QueryController";
import { RegistrationController } from "../controllers/RegistrationController";
import { EventRepository } from "../repos/EventRepository";
import { QueryRepository } from "../repos/QueryRepository";
import { RegistrationRepository } from "../repos/RegistrationRepository";
import { UserRepository } from "../repos/UserRepository";
import { AuthService } from "../services/AuthService";
import { EventService } from "../services/EventService";
import { QueryService } from "../services/QueryService";
import { RegistrationService } from "../services/RegistrationService";

export interface AppContainer {
  authController: AuthController;
  eventController: EventController;
  registrationController: RegistrationController;
  queryController: QueryController;
}

export const buildContainer = (): AppContainer => {
  const userRepository = new UserRepository();
  const eventRepository = new EventRepository();
  const registrationRepository = new RegistrationRepository();
  const queryRepository = new QueryRepository();

  const authService = new AuthService(userRepository);
  const eventService = new EventService(eventRepository);
  const registrationService = new RegistrationService(
    registrationRepository,
    eventRepository,
  );
  const queryService = new QueryService(queryRepository);

  const authController = new AuthController(authService);
  const eventController = new EventController(eventService);
  const registrationController = new RegistrationController(
    registrationService,
  );
  const queryController = new QueryController(queryService);

  return {
    authController,
    eventController,
    registrationController,
    queryController,
  };
};
