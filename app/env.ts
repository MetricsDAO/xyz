import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  ENVIRONMENT: z.string(),
  PINATA_API_KEY: z.string(),
  PINATA_SECRET_API_KEY: z.string(),
  SENTRY_DSN: z.string().optional(),
  DEV_AUTO_INDEX: z.string().optional(),
  DEV_SKIP_IPFS_UPLOAD: z.string().optional(),
});

export default envSchema.parse(process.env);
