import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  ENVIRONMENT: z.string(),
  PINATA_JWT: z.string(),
  PINE_API_KEY: z.string(),
  SENTRY_DSN: z.string().optional(),
  DEV_AUTO_INDEX: z.string().optional(),
});

export default envSchema.parse(process.env);
