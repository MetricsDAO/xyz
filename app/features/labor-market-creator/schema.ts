import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "~/domain/address";
import {
  LaborMarketAppDataSchema,
  LaborMarketConfigSchema,
  LaborMarketTypeSchema,
} from "~/domain/labor-market/schemas";
import { arrayToObject } from "~/domain/shared/utils";

export const BadgeGatingType = z.enum(["Anyone", "Any", "All"]);
export const PermissionType = z.enum(["Badge"]);

export const BadgeSchema = z.preprocess(
  arrayToObject,
  z.object({
    contractAddress: EvmAddressSchema,
    tokenId: z.coerce.number(),
    minBadgeBalance: z.coerce.number().min(1).default(1),
    maxBadgeBalance: z.coerce.number().optional(),
  })
);

export const gatingSchema = z.object({
  gatingType: BadgeGatingType.default("Anyone"),
  numberBadgesRequired: z.coerce.number().optional(),
  badges: z.array(BadgeSchema),
});

export type GatingData = z.infer<typeof gatingSchema>;

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

/** For creating and updating LaborMarkets */
export const LaborMarketFormSchema = z.object({
  configuration: LaborMarketConfigSchema.sourceType(),
  appData: LaborMarketAppDataSchema,
});
export type LaborMarketForm = z.infer<typeof LaborMarketFormSchema>;

export const marketplaceDetailsSchema = z.object({
  title: z.string().min(1),
  type: LaborMarketTypeSchema.default("analyze"),
  description: z.string().min(1),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  tokenAllowlist: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  enforcement: EvmAddressSchema,
});

export type MarketplaceData = z.infer<typeof marketplaceDetailsSchema>;

export const finalMarketSchema = z.object({
  marketplaceData: marketplaceDetailsSchema,
  sponsorData: gatingSchema,
  analystData: gatingSchema,
  reviewerData: gatingSchema,
});

export type finalMarketData = z.infer<typeof finalMarketSchema>;
