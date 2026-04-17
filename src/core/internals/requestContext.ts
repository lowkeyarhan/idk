import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";

export interface RequestContext {
  requestId: string;
  startedAt: number;
}

const contextStorage = new AsyncLocalStorage<RequestContext>();

export const requestContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const context: RequestContext = {
    requestId: randomUUID(),
    startedAt: Date.now(),
  };

  contextStorage.run(context, () => {
    res.setHeader("x-request-id", context.requestId);
    next();
  });
};

export const getRequestContext = (): RequestContext | undefined => {
  return contextStorage.getStore();
};
