import { z } from "zod";
import { EthAddressSchema } from "./address";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["createdAt"]).default("createdAt").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z.array(z.number()).optional().describe("Filter by Likert score."),
  first: z.number().default(10),
  page: z.number().default(1),
  submissionId: z.string().optional(),
});

export const ReviewSchema = z.object({
  laborMarketAddress: EthAddressSchema,
  score: z.number(),
  requestId: z.string(),
  submissionId: z.string(),
});

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
export type ReviewContract = z.infer<typeof ReviewSchema>;
