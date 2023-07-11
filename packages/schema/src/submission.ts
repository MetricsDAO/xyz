import { z } from "zod";
import { SubmissionFormSchema } from "~/features/submission-creator/schema";
import { EvmAddressSchema } from "./address";
import { RewardSchema } from "./reward-submissions";
import { ServiceRequestDocSchema } from "./service-request";
import { LaborMarketDocSchema } from "./labor-market";

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

export const SubmissionConfigSchema = z.object({
  requestId: z.string(),
  submissionId: z.string(),
  uri: z.string(),
  fulfiller: EvmAddressSchema,
});
export type SubmissionConfig = z.infer<typeof SubmissionConfigSchema>;

export const SubmissionDocSchema = z.object({
  id: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  blockTimestamp: z.date(),
  indexedAt: z.date(),
  configuration: SubmissionConfigSchema,
  score: z
    .object({
      reviewCount: z.number(),
      reviewSum: z.number(),
      avg: z.number(),
    })
    .optional(),
  appData: SubmissionFormSchema.nullable(),
  rewardClaimed: z.boolean().optional(), // TODO: not optional
  reward: RewardSchema.optional(),
});

export const SubmissionWithServiceRequestSchema = SubmissionDocSchema.extend({
  sr: ServiceRequestDocSchema,
});

// Reward is not optional
export const SubmissionWithRewardSchema = SubmissionWithServiceRequestSchema.extend({
  reward: RewardSchema,
});

export const CombinedSchema = SubmissionDocSchema.extend({
  sr: ServiceRequestDocSchema,
  lm: LaborMarketDocSchema,
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

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
export type SubmissionContract = z.infer<typeof SubmissionContractSchema>;
export type SubmissionIndexer = z.infer<typeof SubmissionIndexerSchema>;
export type SubmissionDoc = z.infer<typeof SubmissionDocSchema>;
export type SubmissionWithServiceRequest = z.infer<typeof SubmissionWithServiceRequestSchema>;
export type SubmissionWithReward = z.infer<typeof SubmissionWithRewardSchema>;
export type CombinedDoc = z.infer<typeof CombinedSchema>;
export type ShowcaseSearch = z.infer<typeof ShowcaseSearchSchema>;
