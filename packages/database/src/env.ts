import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string(),
  MONGODB_PRISMA_URI: z.string(),
});

export default envSchema.parse(process.env);
