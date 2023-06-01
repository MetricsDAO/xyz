import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "../address";
import { arrayToObject } from "../shared/utils";

/**
 * Normalizes the `configuration` method from the LaborMarket contract so both the contract and the index can use the same type.
 */
export const LaborMarketConfigSchema = z.preprocess(
  arrayToObject,
  z.object({
    deployer: EvmAddressSchema,
    criteria: EvmAddressSchema,
    uri: z.string(),
  })
);
export type LaborMarketConfig = z.infer<typeof LaborMarketConfigSchema>;

/**
 * Types of labor markets. Used n AppData and in filtering.
 */
export const LaborMarketTypeSchema = z.enum(["brainstorm", "analyze"]);
export type LaborMarketType = z.infer<typeof LaborMarketTypeSchema>;

/**
 * AppData is any data that isn't stored by the contract directly but is stored in IPFS instead.
 */
export const LaborMarketAppDataSchema = z.object({
  title: z.string().min(1),
  type: LaborMarketTypeSchema.default("analyze"),
  description: z.string().min(1),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  tokenAllowlist: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  enforcement: EvmAddressSchema,
});
export type LaborMarketAppData = z.infer<typeof LaborMarketAppDataSchema>;

const RewardPoolSchema = z.object({
  pToken: EvmAddressSchema,
  pTokenQuantity: z.coerce.string(),
});

export type RewardPool = z.infer<typeof RewardPoolSchema>;

/**
 * Contains all aggregated and index-specific data for a LaborMarket.
 */
export const LaborMarketIndexDataSchema = z.object({
  indexedAt: z.date().default(() => new Date()),
  serviceRequestCount: z.number(),
  serviceRequestRewardPools: z.array(RewardPoolSchema),
});
export type LaborMarketIndexData = z.infer<typeof LaborMarketIndexDataSchema>;

/**
 * This is the canonical shape of a LaborMarket in our system.
 * Data stored both in the database and the contract/ipfs should match this shape.
 */
export const LaborMarketSchema = z.object({
  address: EvmAddressSchema,
  blockTimestamp: z.date(),
  configuration: LaborMarketConfigSchema,
  appData: LaborMarketAppDataSchema,
});
export type LaborMarket = z.infer<typeof LaborMarketSchema>;

/**
 * This is the same as the LaborMarket but with additional index-specific data.
 */
export const LaborMarketWithIndexDataSchema = LaborMarketSchema.extend({ indexData: LaborMarketIndexDataSchema });
export type LaborMarketWithIndexData = z.infer<typeof LaborMarketWithIndexDataSchema>;

/**
 * For filtering labor markets.
 */
export const LaborMarketFilterSchema = z.object({
  q: z.string().optional(),
  type: LaborMarketTypeSchema,
  token: z.array(z.string()).optional(),
  project: z.array(z.string()).optional(),
});
export type LaborMarketFilter = z.infer<typeof LaborMarketFilterSchema>;

/**
 * For searching labor markets. Extends the filter with pagination and sorting args.
 */
export const LaborMarketSearchSchema = LaborMarketFilterSchema.extend({
  sortBy: z.enum(["blockTimestamp", "indexData.serviceRequestCount"]).default("blockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  first: z.coerce.number().min(1).max(100).default(12),
});
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
