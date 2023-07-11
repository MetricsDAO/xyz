import { z } from "zod";

export const ClaimToReviewFormValuesSchema = z.object({
  quantity: z.coerce.number(),
});

export type ClaimToReviewFormValues = z.infer<typeof ClaimToReviewFormValuesSchema>;
