import { z } from "zod";

const envSchema = z.object({
  ENVIRONMENT: z.string(),
  PINE_API_KEY: z.string(),
});

export default envSchema.parse(process.env);
