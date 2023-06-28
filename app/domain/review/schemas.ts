import { z } from "zod";
import { EvmAddressSchema } from "../address";
import { RewardSchema } from "../reward-submissions/schema";
import { SubmissionDocSchema } from "../submission/schemas";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["blockTimestamp", "score"]).default("blockTimestamp").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z.array(z.string()).optional().describe("Filter by Likert score."),
  first: z.number().default(1000),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
  submissionId: z.string().optional(),
  laborMarketAddress: EvmAddressSchema.optional(),
  reviewer: EvmAddressSchema.optional(),
});

export const ReviewSchema = z.object({
  laborMarketAddress: EvmAddressSchema,
  score: z.number(),
  requestId: z.string(),
  submissionId: z.string(),
});

export const ReviewFormSchema = ReviewSchema.pick({
  score: true,
});

export const ReviewEventSchema = z.object({
  submissionId: z.string(),
  reviewer: EvmAddressSchema,
  reviewScore: z.string(),
  requestId: z.string(),
  reviewId: z.string(),
  uri: z.string(),
});

/**
 * AppData is any data that isn't stored by the contract directly but is stored in IPFS instead.
 */
export const ReviewAppDataSchema = z.object({
  comment: z.string().optional(),
});

export const ReviewDocSchema = z.object({
  id: z.string(),
  submissionId: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  score: z.string(),
  appData: ReviewAppDataSchema,
  comment: z.string().optional(),
  reviewer: EvmAddressSchema,
  blockTimestamp: z.date(),
  indexedAt: z.date(),
  reward: RewardSchema,
});

export const ReviewWithSubmissionSchema = ReviewDocSchema.extend({
  s: SubmissionDocSchema,
});

export const SubmissionWithReviewsDocSchema = SubmissionDocSchema.extend({
  reviews: z.array(ReviewDocSchema),
});

export type ReviewAppData = z.infer<typeof ReviewAppDataSchema>;

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
export type ReviewContract = z.infer<typeof ReviewSchema>;
export type ReviewDoc = z.infer<typeof ReviewDocSchema>;
export type ReviewForm = z.infer<typeof ReviewFormSchema>;
export type ReviewWithSubmission = z.infer<typeof ReviewWithSubmissionSchema>;
export type SubmissionWithReviewsDoc = z.infer<typeof SubmissionWithReviewsDocSchema>;
