import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string(),
  MONGODB_PRISMA_URI: z.string(),
  PINE_SUBSCRIBER_OVERRIDE: z.string().optional(),
  ENVIRONMENT: z.string(),
  PINATA_API_KEY: z.string(),
  PINATA_SECRET_API_KEY: z.string(),
});

export default envSchema.parse(process.env);
