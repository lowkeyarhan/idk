import { createClient } from "@supabase/supabase-js";
import { env } from "./env";
import { logger } from "../utils/logger";

export const dbPool = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

export const testDbConnection = async (): Promise<void> => {
  const { error } = await dbPool.from("users").select("user_id").limit(1);
  if (error) {
    if (error.code !== "PGRST116")
      logger.error("Supabase connection issue.", { error });
  } else {
    logger.info("Supabase connection successfully established.");
  }
};
