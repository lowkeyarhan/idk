import { AuthController } from "../controllers/AuthController";
import { EventController } from "../controllers/EventController";
import { RegistrationController } from "../controllers/RegistrationController";
import { QueryController } from "../controllers/QueryController";

export interface AppContainer {
  authController: AuthController;
  eventController: EventController;
  registrationController: RegistrationController;
  queryController: QueryController;
}
