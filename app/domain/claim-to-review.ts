import { z } from "zod";
import { zfd } from "zod-form-data";

export const ClaimToReviewFormSchema = z.object({
  quantity: zfd.numeric(z.number()),
});

export const ClaimToReviewContractSchema = z.object({
  laborMarketAddress: z.string(),
  serviceRequestId: z.string(),
  quantity: z.number(),
});

export type ClaimToReviewForm = z.infer<typeof ClaimToReviewFormSchema>;
export type ClaimToReviewContract = z.infer<typeof ClaimToReviewContractSchema>;
