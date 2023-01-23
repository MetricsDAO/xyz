import { z } from "zod";

export const ClaimToSubmitContractSchema = z.object({
  laborMarketAddress: z.string(),
  serviceRequestId: z.string(),
});

export type ClaimToSubmitPrepared = z.infer<typeof ClaimToSubmitContractSchema>;
