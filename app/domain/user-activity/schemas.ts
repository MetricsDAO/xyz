import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const ActivityTypeSchema = z.enum([
  "LaborMarketConfigured",
  "RequestConfigured",
  "RequestSignal",
  "ReviewSignal",
  "RequestFulfilled",
  "RequestReviewed",
]);
export const ActivityGroupTypeSchema = z.enum(["LaborMarket", "ServiceRequest", "Submission", "Review"]);
export const ActivityIconTypeSchema = z.enum(["labor-market", "service-request", "submission", "review"]);

export const LaborMarketConfigSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  title: z.string(),
});

export const RequestConfigSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  requestId: z.string(),
  title: z.string(),
});

export const SubmissionConfigSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  requestId: z.string(),
  submissionId: z.string(),
  title: z.string(),
});

export const activityConfigSchema = z.discriminatedUnion("eventType", [
  z.object({
    eventType: z.literal("LaborMarketConfigured"),
    config: LaborMarketConfigSchema,
  }),
  z.object({
    eventType: z.literal("RequestConfigured"),
    config: RequestConfigSchema,
  }),
  z.object({
    eventType: z.literal("RequestSignal"),
    config: RequestConfigSchema,
  }),
  z.object({
    eventType: z.literal("ReviewSignal"),
    config: RequestConfigSchema,
  }),
  z.object({
    eventType: z.literal("RequestFulfilled"),
    config: SubmissionConfigSchema,
  }),
  z.object({
    eventType: z.literal("RequestReviewed"),
    config: SubmissionConfigSchema,
  }),
]);

export type ActivityTypes = z.infer<typeof ActivityTypeSchema>;

export const ActivityDocSchema = z.object({
  groupType: ActivityGroupTypeSchema,
  eventType: activityConfigSchema,
  iconType: ActivityIconTypeSchema,
  actionName: z.string(),
  userAddress: z.string(),
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
});

export type ActivityDoc = z.infer<typeof ActivityDocSchema>;

/**
 * For filtering activity events.
 */
export const ActivityFilterSchema = z.object({
  q: z.string().optional(),
  groupType: z
    .array(ActivityGroupTypeSchema)
    .optional()
    .default(["LaborMarket", "ServiceRequest", "Review", "Submission"]),
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
<<<<<<< HEAD
=======

export const ParticipantSearchSchema = z.object({
  q: z.string().optional(),
  sortBy: z.enum(["createdAtBlockTimestamp"]).default("createdAtBlockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  eventType: z.array(ActivityTypeSchema).optional(),
});
export type ParticipantSearch = z.infer<typeof ParticipantSearchSchema>;
>>>>>>> 8e7b3ce90f63283c49cea781ff8bd91a82ee50f9
