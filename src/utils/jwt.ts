import jwt from "jsonwebtoken";
import { UserRole } from "../dto/UserDTO";
import { AuthPayload } from "../dto/AuthPayloadDTO";

const SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as any });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, SECRET) as AuthPayload;
};
