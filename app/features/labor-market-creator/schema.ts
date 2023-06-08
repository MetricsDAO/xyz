import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "~/domain/address";
import { LaborMarketTypeSchema } from "~/domain/labor-market/schemas";
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

export const GatingSchema = z.object({
  gatingType: BadgeGatingType.default("Anyone"),
  numberBadgesRequired: z.coerce.number().optional(),
  badges: z.array(BadgeSchema),
});

export type GatingData = z.infer<typeof GatingSchema>;

export const AppDataSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["brainstorm", "analyze"]),
  description: z.string().min(1),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  tokenAllowlist: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  enforcement: EvmAddressSchema,
});

export type AppData = z.infer<typeof AppDataSchema>;

export const MarketplaceFormSchema = z.object({
  appData: AppDataSchema,
  sponsor: GatingSchema,
  analyst: GatingSchema,
  reviewer: GatingSchema,
});

export type MarketplaceForm = z.infer<typeof MarketplaceFormSchema>;
