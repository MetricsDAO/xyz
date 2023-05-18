import { z } from "zod";
import { SubmissionFormSchema } from "~/features/submission-creator/schema";
import { EvmAddressSchema } from "../address";
import { LaborMarketWithIndexDataSchema } from "../labor-market/schemas";
import { ReviewDocSchema } from "../review/schemas";
import { ServiceRequestWithIndexDataSchema } from "../service-request/schemas";

export const SubmissionSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["appData.title", "appData.description", "blockTimestamp"]).default("blockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z.array(z.enum(["spam", "bad", "average", "good", "stellar"])).optional(),
  first: z.number().default(15),
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

export const SubmissionDocSchema = z.object({
  id: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  blockTimestamp: z.date().nullable().optional(),
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
  sortBy: z.enum(["sr[0].appData.title", "blockTimestamp"]).default("blockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  first: z.number().default(100),
  page: z.number().default(1),
  token: z.array(z.string()).optional(),
  isPastEnforcementExpiration: z.boolean().default(true),
  serviceProvider: EvmAddressSchema.optional(),
});

export const ShowcaseSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  marketplace: z.array(EvmAddressSchema).optional(),
  project: z.array(z.string()).optional(),
  score: z.enum(["good", "stellar"]).optional(),
  timeframe: z.enum(["day", "month", "week"]).default("month"),
  first: z.number().default(50),
  page: z.number().default(1),
});

export const SubmissionWithReviewsDocSchema = SubmissionDocSchema.extend({
  reviews: z.array(ReviewDocSchema),
});

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
export type SubmissionContract = z.infer<typeof SubmissionContractSchema>;
export type SubmissionIndexer = z.infer<typeof SubmissionIndexerSchema>;
export type SubmissionDoc = z.infer<typeof SubmissionDocSchema>;
export type SubmissionWithServiceRequest = z.infer<typeof SubmissionWithServiceRequestSchema>;
export type CombinedDoc = z.infer<typeof CombinedSchema>;
export type RewardsSearch = z.infer<typeof RewardsSearchSchema>;
export type ShowcaseSearch = z.infer<typeof ShowcaseSearchSchema>;
export type SubmissionWithReviewsDoc = z.infer<typeof SubmissionWithReviewsDocSchema>;
