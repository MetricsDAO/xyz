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
    // z.object({ access: z.literal("anyone") }), Not needed for MVP
    z.object({
      access: z.literal("delegates"),
      badgerAddress: EvmAddressSchema,
      badgerTokenId: z.string().min(1, "Required"),
    }),
  ]),
  submitRepMin: zfd.numeric(z.number()),
  submitRepMax: zfd.numeric(z.number()),
  reviewBadgerAddress: EvmAddressSchema,
  reviewBadgerTokenId: z.string().min(1, "Required"),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  sponsorAddress: EvmAddressSchema,
});

// The properties of a LaborMarket that live off-chain (e.g IPFS). These are properties that are specific to the MDAO app.
export const LaborMarketMetaSchema = LaborMarketSchema.pick({
  title: true,
  description: true,
  type: true,
  projectSlugs: true,
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
      badgerAddress: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
      badgerTokenId: "2",
    },
    submitRepMin: faker.datatype.number(100),
    submitRepMax: faker.datatype.number(100),
    reviewBadgerAddress: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
    reviewBadgerTokenId: "3",
    projectSlugs: ["ethereum", "polygon"],
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
  sortBy: z.enum(["createdAtBlockTimestamp", "title"]).default("createdAtBlockTimestamp").describe("Sort by column."),
  type: z.enum(["brainstorm", "analyze"]).describe("Type of the labor market (MDAO specific)."),
  order: z.enum(["asc", "desc"]).default("desc").describe("Order of the results."),
  project: z.array(z.string()).optional().describe("Project slugs to filter by."),
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
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
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
  serviceRequestRewardPools: z.array(
    z.object({
      pToken: EvmAddressSchema,
      pTokenQuantity: z.string(),
    })
  ),
  appData: LaborMarketMetaSchema.nullable(),
});

export type LaborMarketDoc = z.infer<typeof LaborMarketDocSchema>;
export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketForm = z.infer<typeof LaborMarketFormSchema>;
export type LaborMarketContract = z.infer<typeof LaborMarketContractSchema>;
export type LaborMarketMeta = z.infer<typeof LaborMarketMetaSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
