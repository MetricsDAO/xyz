import { z } from "zod";

export const ClaimToReviewFormValuesSchema = z.object({
  quantity: z.string(),
});

export type ClaimToReviewFormValues = z.infer<typeof ClaimToReviewFormValuesSchema>;
