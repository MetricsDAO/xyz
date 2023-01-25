import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "./address";

export const ClaimToReviewContractSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  quantity: zfd.numeric(z.number()),
});

export type ClaimToReviewContract = z.infer<typeof ClaimToReviewContractSchema>;
