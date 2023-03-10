import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const ActivityTypeSchema = z.enum(["LaborMarketConfigured"]);

export type ActivityTypes = z.infer<typeof ActivityTypeSchema>;

export const ActivityDocSchema = z.object({
  id: z.string(),
  eventType: ActivityTypeSchema,
  userAddress: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string().nullable(),
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
});

export type ActivityDoc = z.infer<typeof ActivityDocSchema>;

/**
 * For filtering activity events.
 */
export const ActivityFilterSchema = z.object({
  q: z.string().optional(),
  eventType: z.array(ActivityTypeSchema).optional(),
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
