import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../dto/UserDTO";

export interface AuthPayload {
  userId: number;
  role: UserRole;
}

export const signToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
};
