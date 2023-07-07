import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const fetchSignaturesBodySchema = z.array(
  z.object({
    participationID: z.string(),
    claimerAddress: EvmAddressSchema,
    marketplaceAddress: EvmAddressSchema,
    iouAddress: EvmAddressSchema,
    type: z.enum(["submission", "review"]),
    amount: z.string(),
  })
);
export type FetchSignaturesBody = z.infer<typeof fetchSignaturesBodySchema>;

export const FetchClaimsInputSchema = z.array(
  z.object({
    marketplaceAddress: EvmAddressSchema,
    participationId: z.string(),
    type: z.enum(["submission", "review"]),
  })
);
export type FetchClaimsInput = z.infer<typeof FetchClaimsInputSchema>;

export const fetchSignaturesResponseSchema = z.array(
  z.object({
    signedBody: z.object({
      participationID: z.string(),
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
        participationID: z.string(),
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

export type IOUToken = z.infer<typeof IOUTokenSchema>;

export const IOUTokenMetadataSchema = z.object({
  metadata: z.array(IOUTokenSchema),
  signature: z.string(),
});

export const IOUTokenPostMetadataSchema = z.object({
  tokenName: z.string(),
  chain: z.string(),
  decimals: z.number(),
  fireblocksTokenName: z.string(),
  iOUTokenContract_addresses: z.array(EvmAddressSchema),
});

export type IOUTokenPost = z.infer<typeof IOUTokenPostMetadataSchema>;

export const IOUMetadataResponseSchema = z.object({
  id: z.string(),
  tokenName: z.string(),
  chain: z.string(),
  fireblocksTokenName: z.string(),
  decimals: z.number(),
});

export type IOUMetadataPostResponse = z.infer<typeof IOUMetadataResponseSchema>;

export const requestMintSchema = z.object({
  source: EvmAddressSchema,
  to: EvmAddressSchema,
  nonce: z.number(),
  amount: z.number(),
});

export type requestMint = z.infer<typeof requestMintSchema>;

export const mintResponseSchema = z.object({
  id: z.string(),
  tokenName: z.string(),
  chain: z.string(),
  fireblocksTokenName: z.string(),
  decimals: z.number(),
  signedBody: z.object({
    source: EvmAddressSchema,
    to: EvmAddressSchema,
    nonce: z.string(),
    amount: z.number(),
    expiration: z.date(),
  }),
  signature: z.string(),
});
