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
  submitRepMax: zfd.numeric(z.number().optional()),
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
});

export const LaborMarketFormSchema = LaborMarketSchema.omit({ address: true, sponsorAddress: true });

// Schema for a labor market with an IPFS CID.
export const LaborMarketContractSchema = LaborMarketFormSchema.extend({
  ipfsHash: z.string(),
  userAddress: EvmAddressSchema,
});

// Used for searching and filtering marketplaces.
export const LaborMarketSearchSchema = zfd.formData({
  q: z.string().optional().describe("Search query."),
  sortBy: z
    .enum(["createdAtBlockTimestamp", "serviceRequestCount"])
    .default("createdAtBlockTimestamp")
    .describe("Sort by column."),
  type: z.enum(["brainstorm", "analyze"]).describe("Type of the labor market (MDAO specific)."),
  order: z.enum(["asc", "desc"]).default("desc").describe("Order of the results."),
  project: z.array(z.string()).optional().describe("Project slugs to filter by."),
  token: z.array(z.string()).optional().describe("Token symbols to filter by."),
  page: z.coerce.number().min(1).default(1).describe("Page number."),
  first: z.coerce.number().min(1).max(100).default(12).describe("The number of results to return."),
});

export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketContract = z.infer<typeof LaborMarketContractSchema>;
export type LaborMarketMeta = z.infer<typeof LaborMarketMetaSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
