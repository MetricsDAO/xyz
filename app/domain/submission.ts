import { z } from "zod";
import { EthAddressSchema } from "./address";

export const SubmissionSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["title", "description", "createdAt", "reviews", "creatorId"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
  score: z.enum(["Great", "Good", "Average", "Bad", "Spam"]).optional(),
  first: z.number().default(10),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
});

export const SubmissionContractSchema = z.object({
  laborMarketAddress: EthAddressSchema,
  serviceRequestId: z.number(),
  uri: z.string(),
});

export const SubmissionFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const SubmissionIndexerSchema = z.object({
  id: z.string(),
  serviceRequestId: z.string(),
  laborMarketAddress: EthAddressSchema,
  creatorId: z.string(),
  scoreStatus: z.enum(["Great", "Good", "Average", "Bad", "Spam"]),
  title: z.string(),
  description: z.string(),
});

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
export type SubmissionContract = z.infer<typeof SubmissionContractSchema>;
export type SubmissionForm = z.infer<typeof SubmissionFormSchema>;
export type SubmissionIndexer = z.infer<typeof SubmissionIndexerSchema>;
