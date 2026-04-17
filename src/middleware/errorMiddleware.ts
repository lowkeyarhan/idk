import { NextFunction, Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { getRequestContext } from "../core/internals/requestContext";
import { logger } from "../utils/logger";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId = getRequestContext()?.requestId ?? null;

  if (error instanceof ApiError) {
    logger.warn(error.message, {
      requestId,
      statusCode: error.statusCode,
      details: error.details ?? null
    });

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details ?? null,
      requestId
    });
    return;
  }

  if (error instanceof Error) {
    logger.error(error.message, {
      requestId,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: error.message,
      requestId
    });
    return;
  }

  logger.error("Unhandled non-error throwable", { requestId });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    requestId
  });
};
