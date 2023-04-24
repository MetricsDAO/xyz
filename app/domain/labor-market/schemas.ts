import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "../address";
import { arrayToObject } from "../shared/utils";

export const BadgePairSchema = z.preprocess(
  arrayToObject,
  z.object({
    token: EvmAddressSchema,
    tokenId: z.coerce.string(),
  })
);
export type BadgePair = z.infer<typeof BadgePairSchema>;

export const LaborMarketModules = z.object({
  network: EvmAddressSchema,
  enforcement: EvmAddressSchema,
  enforcementKey: z.string(),
  reputation: EvmAddressSchema,
});

export const LaborMarketReputationParams = z.object({
  rewardPool: z.coerce.string(),
  provideStake: z.coerce.string(),
  submitMin: z.coerce.string(),
  submitMax: z.coerce.string(),
});

/**
 * Normalizes the `configuration` method from the LaborMarket contract so both the contract and the index can use the same type.
 */
export const LaborMarketConfigSchema = z.preprocess(
  arrayToObject,
  z.object({
    marketUri: z.string(),
    owner: EvmAddressSchema,
    maintainerBadge: BadgePairSchema,
    delegateBadge: BadgePairSchema,
    reputationBadge: BadgePairSchema,
    reputationParams: z.preprocess(arrayToObject, LaborMarketReputationParams),
    modules: z.preprocess(arrayToObject, LaborMarketModules),
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
  description: z.string().min(1),
  type: LaborMarketTypeSchema.default("analyze"),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  tokenAllowlist: zfd.repeatable(z.array(z.string()).min(1, "Required")),
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
  configuration: LaborMarketConfigSchema,
  appData: LaborMarketAppDataSchema,
  blockTimestamp: z.date().nullable().optional(),
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

/** For creating and updating LaborMarkets */
export const LaborMarketFormSchema = z.object({
  configuration: LaborMarketConfigSchema.sourceType().omit({ marketUri: true, owner: true }),
  appData: LaborMarketAppDataSchema,
});
export type LaborMarketForm = z.infer<typeof LaborMarketFormSchema>;

export const step1Schema = z.object({
  title: z.string().min(1),
  type: LaborMarketTypeSchema.default("analyze"),
  description: z.string().min(1),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  tokenAllowlist: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  enforcement: EvmAddressSchema,
});

export type step1Data = z.infer<typeof step1Schema>;

export const BadgeGatingType = z.enum(["Anyone", "Any", "All"]);
export const PermissionType = z.enum(["Badge"]);

export const BadgeSchema = z.preprocess(
  arrayToObject,
  z.object({
    type: PermissionType.default("Badge"),
    contractAddress: EvmAddressSchema,
    tokenId: z.coerce.string(),
    minBadgeBalance: z.number().min(1).default(1),
    maxBadgeBalance: z.number().optional(),
  })
);

export const step2Schema = z.object({
  gatingType: BadgeGatingType.default("Anyone"),
  numberBadgesRequired: z.number().min(1).default(1),
  sponsorBadges: zfd.repeatable(z.array(BadgeSchema)),
});

export type step2Data = z.infer<typeof step2Schema>;
