import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const ActivityTypeSchema = z.enum(["LaborMarketConfigured"]);
export const ActivityGroupTypeSchema = z.enum(["LaborMarket"]);
export const ActivityIconTypeSchema = z.enum(["labor-market"]);

export const LaborMarketConfiguredConfigSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  laborMarketTitle: z.string(),
});

export const activityConfigSchema = z.discriminatedUnion("eventType", [
  z.object({
    eventType: z.literal("LaborMarketConfigured"),
    config: LaborMarketConfiguredConfigSchema,
  }),
]);

export type ActivityTypes = z.infer<typeof ActivityTypeSchema>;

export const ActivityDocSchema = z.object({
  groupType: ActivityGroupTypeSchema,
  iconType: ActivityIconTypeSchema,
  actionName: z.string(),
  userAddress: z.string(),
  config: activityConfigSchema,
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
});

export type ActivityDoc = z.infer<typeof ActivityDocSchema>;

/**
 * For filtering activity events.
 */
export const ActivityFilterSchema = z.object({
  q: z.string().optional(),
  groupType: z.array(ActivityGroupTypeSchema).optional(),
});

export type ActivityFilter = z.infer<typeof ActivityFilterSchema>;

/**
 * For searching labor markets. Extends the filter with pagination and sorting args.
 */
export const ActivitySearchSchema = ActivityFilterSchema.extend({
  sortBy: z.enum(["createdAtBlockTimestamp", "indexedAt"]).default("createdAtBlockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  first: z.coerce.number().min(1).max(100).default(12),
});
export type ActivitySearch = z.infer<typeof ActivitySearchSchema>;
