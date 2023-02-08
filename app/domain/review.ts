import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["createdAt"]).default("createdAt").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z.array(z.number()).optional().describe("Filter by Likert score."),
  first: z.number().default(10),
  page: z.number().default(1),
  submissionId: z.string().optional(),
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
  reviewer: z.string(),
  reviewScore: z.string(),
  requestId: z.string(),
});

const ReviewDocSchema = z.object({
  id: z.string().describe("The request id"),
  laborMarketAddress: EvmAddressSchema,
  serviceRequestId: z.string(),
  score: z.string(),
  reviewer: z.string(),
  indexedAt: z.date(),
});

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
export type ReviewContract = z.infer<typeof ReviewSchema>;
export type ReviewDoc = z.infer<typeof ReviewDocSchema>;
export type ReviewForm = z.infer<typeof ReviewFormSchema>;
