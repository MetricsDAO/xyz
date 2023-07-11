import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const ClaimToSubmitContractSchema = z.object({
  laborMarketAddress: z.string(),
  serviceRequestId: z.string(),
});

export const ClaimToSubmitEventSchema = z.object({
  requestId: z.string(),
  signaler: EvmAddressSchema,
});

export type ClaimToSubmitPrepared = z.infer<typeof ClaimToSubmitContractSchema>;
