import { z } from "zod";

const envSchema = z.object({
  TREASURY_URL: z.string(),
  TREASURY_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  MONGODB_URI: z.string(),
  SESSION_SECRET: z.string(),
  ENVIRONMENT: z.string(),
  PINATA_API_KEY: z.string(),
  PINATA_SECRET_API_KEY: z.string(),
  PINE_API_KEY: z.string(),
  PINE_SUBSCRIBER_OVERRIDE: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  QUICKNODE_URL: z.string(),
  DEV_SKIP_IPFS_UPLOAD: z.string().optional(),
  FLIPSIDE_API_KEY: z.string(),
});

export default envSchema.parse(process.env);
