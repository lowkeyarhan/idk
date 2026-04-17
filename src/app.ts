import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import "./core/polyfills";
import { getContainer } from "./container/container";
import { requestContextMiddleware } from "./core/internals/requestContext";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import { globalLimiter } from "./middleware/rateLimiters";
import { buildApiRouter } from "./routes";
import { env } from "./config/env";

const parseCorsOrigins = (value: string): string[] | true => {
  if (value === "*") {
    return true;
  }
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const createApp = () => {
  const app = express();
  const container = getContainer();

  morgan.token("request-id", (_req, res) =>
    String(res.getHeader("x-request-id") ?? "-"),
  );

  app.use(requestContextMiddleware);
  app.use(helmet());
  app.use(cors({ origin: parseCorsOrigins(env.CORS_ORIGIN) }));
  app.use(compression());
  app.use(globalLimiter);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms [request-id=:request-id]",
    ),
  );
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend is healthy",
    });
  });

  app.use("/api/v1", buildApiRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
