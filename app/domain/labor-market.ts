import { faker } from "@faker-js/faker";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "./address";

export const LaborMarketSchema = z.object({
  address: z.string(),
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  type: z.enum(["brainstorm", "analyze"]),
  launch: z.discriminatedUnion("access", [
    z.object({ access: z.literal("anyone") }),
    z.object({
      access: z.literal("delegates"),
      badgerAddress: EvmAddressSchema,
      badgerTokenId: z.string().min(1, "Required"),
    }),
  ]),
  rewardCurveAddress: EvmAddressSchema,
  submitRepMin: zfd.numeric(z.number()),
  submitRepMax: zfd.numeric(z.number()),
  reviewBadgerAddress: EvmAddressSchema,
  reviewBadgerTokenId: z.string().min(1, "Required"),
  tokenIds: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  projectIds: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  sponsorAddress: EvmAddressSchema,
});

// The properties of a LaborMarket that live off-chain (e.g IPFS). These are properties that are specific to the MDAO app.
export const LaborMarketMetaSchema = LaborMarketSchema.pick({
  title: true,
  description: true,
  type: true,
  projectIds: true,
  rewardTokens: true,
});

export const LaborMarketFormSchema = LaborMarketSchema.omit({ address: true, sponsorAddress: true });

// Generate a fake LaborMarketNew for testing using faker.
export function fakeLaborMarketNew(): LaborMarketForm {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(2),
    type: "brainstorm",
    launch: {
      access: "delegates",
      badgerAddress: "0xce5dFf7E45187fDEb10fAc24c3cFB20E039ac5fd",
      badgerTokenId: "1",
    },
    rewardCurveAddress: faker.finance.ethereumAddress(),
    submitRepMin: faker.datatype.number(100),
    submitRepMax: faker.datatype.number(100),
    reviewBadgerAddress: "0xce5dFf7E45187fDEb10fAc24c3cFB20E039ac5fd",
    reviewBadgerTokenId: "0",
    tokenIds: [],
    projectIds: [],
  };
}

// Schema for a labor market with an IPFS CID.
export const LaborMarketContractSchema = LaborMarketFormSchema.extend({
  ipfsHash: z.string(),
  userAddress: EvmAddressSchema,
});

// Used for searching and filtering marketplaces.
export const LaborMarketSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["title", "serviceRequests"]).default("title").describe("Sort by column."),
  type: z.enum(["brainstorm", "analyze"]).describe("Type of the labor market (MDAO specific)."),
  order: z.enum(["asc", "desc"]).default("desc").describe("Order of the results."),
  project: z.array(z.string()).optional().describe("Project IDs to filter by."),
  token: z.array(z.string()).optional().describe("Token symbols to filter by."),
  page: z.number().min(1).default(1).describe("Page number."),
  first: z.number().min(1).max(100).default(12).describe("The number of results to return."),
});

const BadgePairSchema = z.object({
  token: EvmAddressSchema,
  tokenId: z.string(),
});

/**
 * The schema for a LaborMarketDocument. This should be identical to how the document is stored in mongo.
 */
const LaborMarketDocSchema = z.object({
  address: EvmAddressSchema,
  valid: z.boolean(),
  configuration: z.object({
    marketUri: z.string(),
    owner: EvmAddressSchema,
    maintainerBadge: BadgePairSchema,
    delegateBadge: BadgePairSchema,
    reputationBadge: BadgePairSchema,
    reputationParams: z.object({
      rewardPool: z.number(),
      signalStake: z.number(),
      submitMin: z.number(),
      submitMax: z.number(),
    }),
    modules: z.object({
      network: EvmAddressSchema,
      enforcement: EvmAddressSchema,
      payment: EvmAddressSchema,
      reputation: EvmAddressSchema,
    }),
  }),
  serviceRequestCount: z.number(),
  appData: LaborMarketMetaSchema.nullable(),
});

export type LaborMarketDoc = z.infer<typeof LaborMarketDocSchema>;
export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketForm = z.infer<typeof LaborMarketFormSchema>;
export type LaborMarketContract = z.infer<typeof LaborMarketContractSchema>;
export type LaborMarketMeta = z.infer<typeof LaborMarketMetaSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
