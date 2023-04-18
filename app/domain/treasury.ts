import { z } from "zod";
import { EvmAddressSchema } from "./address";

const signedBodySchema = z.object({
  submissionID: z.number(),
  claimerAddress: EvmAddressSchema,
  marketplaceAddress: EvmAddressSchema,
});

export const signClaimResponseSchema = z.array(
  z.object({
    signedBody: signedBodySchema,
    signature: z.string(),
  })
);
