import { env } from "./config/env";
import { testDbConnection } from "./config/database";
import { createApp } from "./app";
import { logger } from "./utils/logger";

const bootstrap = async (): Promise<void> => {
  await testDbConnection();

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });
};

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap application", {
    error: error instanceof Error ? error.message : "Unknown startup error",
  });
  process.exit(1);
});
