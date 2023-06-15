import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const fetchSignaturesBodySchema = z.array(
  z.object({
    submissionID: z.number(),
    claimerAddress: EvmAddressSchema,
    marketplaceAddress: EvmAddressSchema,
    iouAddress: EvmAddressSchema,
    type: z.literal("submission"),
    amount: z.string(),
  })
);
export type FetchSignaturesBody = z.infer<typeof fetchSignaturesBodySchema>;

export const fetchSignaturesResponseSchema = z.array(
  z.object({
    signedBody: z.object({
      submissionID: z.number(),
      claimerAddress: EvmAddressSchema,
      marketplaceAddress: EvmAddressSchema,
    }),
    signature: z.string(),
  })
);
export type FetchSignaturesResponse = z.infer<typeof fetchSignaturesResponseSchema>;

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
export type FetchClaimsResponse = z.infer<typeof fetchClaimsResponseSchema>;

const IOUTokenSchema = z.object({
  id: z.string(),
  tokenName: z.string(),
  chain: z.string(),
  fireblocksTokenName: z.string(),
  decimals: z.number(),
  balance: z.string(),
});

export const IOUTokenMetadataSchema = z.object({
  metadata: z.array(IOUTokenSchema),
  signature: z.string(),
});
