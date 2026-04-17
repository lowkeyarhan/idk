import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(16).default("fallback_secret_for_dev_only_123"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(2),
});

const parsed = envSchema.safeParse({
  ...process.env,
  SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http') ? process.env.SUPABASE_URL : 'https://YOUR_SUPABASE_PROJECT_URL.supabase.co'
});

if (!parsed.success) {
  const messages = parsed.error.issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`,
  );
  throw new Error(`Invalid environment variables:\n${messages.join("\n")}`);
}

export const env = parsed.data;
