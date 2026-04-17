import { getRequestContext } from "../core/internals/requestContext";

const nowIso = (): string => new Date().toISOString();

type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, meta?: Record<string, unknown>): void => {
  const context = getRequestContext();
  const payload = {
    ts: nowIso(),
    level,
    requestId: context?.requestId ?? null,
    message,
    ...(meta ? { meta } : {})
  };

  const serialized = `[${payload.ts}] [${payload.level.toUpperCase()}] ${payload.requestId ? `[${payload.requestId}] ` : ""}${message}${meta ? ` ${JSON.stringify(meta)}` : ""}`;

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
};

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta)
};
