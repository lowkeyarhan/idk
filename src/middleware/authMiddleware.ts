import { NextFunction, Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { UserRole } from "../dto/UserDTO";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.header("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid authorization token");
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyToken(token);

  req.user = {
    userId: payload.userId,
    role: payload.role,
  };

  next();
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
};
