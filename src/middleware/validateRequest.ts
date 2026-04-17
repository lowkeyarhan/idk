import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../core/errors/ApiError";

type RequestShape = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export const validateRequest = <T extends RequestShape>(
  schema: ZodSchema<T>,
): RequestHandler => {
  return (req, _res, next) => {
    const parseResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parseResult.success) {
      return next(
        new ApiError(400, "Validation failed", parseResult.error.issues),
      );
    }

    if (parseResult.data.body) {
      req.body = parseResult.data.body;
    }
    if (parseResult.data.query) {
      req.query = parseResult.data.query as unknown as typeof req.query;
    }
    if (parseResult.data.params) {
      req.params = parseResult.data.params as unknown as typeof req.params;
    }

    return next();
  };
};
