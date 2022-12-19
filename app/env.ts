import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  ENVIRONMENT: z.string(),
  SENTRY_DSN: z.string().optional(),
});

export default envSchema.parse(process.env);
