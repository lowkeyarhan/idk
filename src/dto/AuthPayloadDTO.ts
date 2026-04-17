import { UserRole } from "./UserDTO";

export interface AuthPayload {
  userId: number;
  role: UserRole;
}
