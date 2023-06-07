import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["blockTimestamp", "score"]).default("blockTimestamp").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z.array(z.string()).optional().describe("Filter by Likert score."),
  first: z.number().default(1000),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
  submissionId: z.string().optional(),
  laborMarketAddress: EvmAddressSchema.optional(),
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

export const ReviewDocSchema = z.object({
  submissionId: z.string(),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  score: z.string(),
  reviewer: EvmAddressSchema,
  blockTimestamp: z.date(),
  indexedAt: z.date(),
});

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
export type ReviewContract = z.infer<typeof ReviewSchema>;
export type ReviewDoc = z.infer<typeof ReviewDocSchema>;
export type ReviewForm = z.infer<typeof ReviewFormSchema>;
