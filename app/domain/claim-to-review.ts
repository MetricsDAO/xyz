import { z } from "zod";
import { zfd } from "zod-form-data";

export const ClaimToReviewPreparedSchema = z.object({
  quantity: zfd.numeric(z.number()),
});

export type ClaimToReviewPrepared = z.infer<typeof ClaimToReviewPreparedSchema>;
