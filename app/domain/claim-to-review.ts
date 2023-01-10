import { z } from "zod";
import { zfd } from "zod-form-data";
import { EthAddressSchema } from "./address";

export const ClaimToReviewContractSchema = z.object({
  laborMarketAddress: EthAddressSchema,
  quantity: zfd.numeric(z.number()),
});

export type ClaimToReviewContract = z.infer<typeof ClaimToReviewContractSchema>;
