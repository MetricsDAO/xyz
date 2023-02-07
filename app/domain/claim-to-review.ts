import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "./address";

export const ClaimToReviewFormSchema = z.object({
  quantity: zfd.numeric(z.number()),
});

export const ClaimToReviewContractSchema = z.object({
  laborMarketAddress: z.string(),
  serviceRequestId: z.string(),
  quantity: z.number(),
});

export const ClaimToReviewEventSchema = z.object({
  requestId: z.string(),
  signalAmount: z.string(),
  signaler: EvmAddressSchema,
});

export type ClaimToReviewForm = z.infer<typeof ClaimToReviewFormSchema>;
export type ClaimToReviewContract = z.infer<typeof ClaimToReviewContractSchema>;
