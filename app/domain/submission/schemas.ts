import { z } from "zod";
import { EvmAddressSchema } from "../address";
import { LaborMarketWithIndexDataSchema } from "../labor-market/schemas";
import { ReviewDocSchema } from "../review";
import { ServiceRequestWithIndexDataSchema } from "../service-request/schemas";

export const SubmissionSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["title", "description", "createdAt", "reviews", "creatorId"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
  score: z.number().optional(),
  first: z.number().default(10),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
  laborMarketAddress: EvmAddressSchema.optional(),
  serviceProvider: EvmAddressSchema.optional(),
});

export const SubmissionContractSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  uri: z.string(),
});

export const SubmissionFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  submissionUrl: z.string().optional(),
});

export const SubmissionIndexerSchema = z.object({
  id: z.string(),
  contractId: z.string(),
  score: z.number(),
  serviceRequestId: z.string(),
  laborMarketAddress: EvmAddressSchema,
  creatorId: z.string(),
  title: z.string(),
  description: z.string(),
});

const SubmissionDocSchema = z.object({
  id: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  valid: z.boolean(),
  submissionUrl: z.string().nullable(),
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
  configuration: z.object({
    serviceProvider: EvmAddressSchema,
    uri: z.string(),
  }),
  score: z
    .object({
      reviewCount: z.number(),
      reviewSum: z.number(),
      avg: z.number(),
      qualified: z.boolean(),
    })
    .optional(),
  appData: SubmissionFormSchema.nullable(),
});

export const SubmissionEventSchema = z.object({
  requestId: z.string(),
  submissionId: z.string(),
});

export const SubmissionWithServiceRequestSchema = SubmissionDocSchema.extend({
  sr: ServiceRequestWithIndexDataSchema,
});

const CombinedSchema = SubmissionDocSchema.extend({
  sr: ServiceRequestWithIndexDataSchema,
  lm: LaborMarketWithIndexDataSchema,
});

export const RewardsSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["sr[0].appData.title", "createdAtBlockTimestamp"]).default("createdAtBlockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  first: z.number().default(10),
  page: z.number().default(1),
  token: z.array(z.string()).optional(),
  isPastEnforcementExpiration: z.boolean().default(true),
  serviceProvider: EvmAddressSchema.optional(),
});

export const ShowcaseSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  count: z.number().default(0),
  marketplace: z.array(EvmAddressSchema).optional(),
  project: z.array(z.string()).optional(),
  score: z.number().optional(),
  timeframe: z.enum(["day", "month", "week"]).default("month"),
});

export const SubmissionWithReviewsDocSchema = SubmissionDocSchema.extend({
  reviews: z.array(ReviewDocSchema),
});

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
export type SubmissionContract = z.infer<typeof SubmissionContractSchema>;
export type SubmissionForm = z.infer<typeof SubmissionFormSchema>;
export type SubmissionIndexer = z.infer<typeof SubmissionIndexerSchema>;
export type SubmissionDoc = z.infer<typeof SubmissionDocSchema>;
export type SubmissionWithServiceRequest = z.infer<typeof SubmissionWithServiceRequestSchema>;
export type CombinedDoc = z.infer<typeof CombinedSchema>;
export type RewardsSearch = z.infer<typeof RewardsSearchSchema>;
export type ShowcaseSearch = z.infer<typeof ShowcaseSearchSchema>;
export type SubmissionWithReviewsDoc = z.infer<typeof SubmissionWithReviewsDocSchema>;
