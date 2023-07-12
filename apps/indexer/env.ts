import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string(),
  MONGODB_PRISMA_URI: z.string(),
  ENVIRONMENT: z.string(),
  PINATA_API_KEY: z.string(),
  PINATA_SECRET_API_KEY: z.string(),
  PINE_API_KEY: z.string(),
  PINE_SUBSCRIBER_OVERRIDE: z.string().optional(),
});

export default envSchema.parse(process.env);
