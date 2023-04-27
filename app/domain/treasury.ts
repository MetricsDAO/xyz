import { z } from "zod";
import { EvmAddressSchema } from "./address";

const fetchSignaturesBodySchema = z.object({
  submissionID: z.number(),
  claimerAddress: EvmAddressSchema,
  marketplaceAddress: EvmAddressSchema,
});

export const fetchSignaturesResponseSchema = z.array(
  z.object({
    signedBody: fetchSignaturesBodySchema,
    signature: z.string(),
  })
);

export const fetchClaimsResponseSchema = z.object({
  claims: z.object({
    ok: z.boolean(),
    err: z.boolean(),
    val: z.array(
      z.object({
        id: z.string(),
        iouAddress: EvmAddressSchema,
        claimerAddress: EvmAddressSchema,
        marketplaceAddress: EvmAddressSchema,
        submissionID: z.number(),
        type: z.string(),
        amount: z.string(),
        redeemTx: z.string().nullable(),
        createdAt: z.string().transform((value) => new Date(value)),
      })
    ),
  }),
});
