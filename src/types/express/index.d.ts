import { UserRole } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: UserRole;
      };
    }
  }
}

export {};
