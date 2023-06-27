import { z } from "zod";

export const ReviewFormValuesSchema = z.object({
  score: z.number().int().min(0).max(4),
  comment: z.string(),
});

export type ReviewFormValues = z.infer<typeof ReviewFormValuesSchema>;
