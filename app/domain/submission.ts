import { z } from "zod";

export const SubmissionSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["title", "description", "createdAt", "reviews", "creatorId"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
  score: z.enum(["Great", "Good", "Average", "Bad", "Spam"]).optional(),
  first: z.number().default(10),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
});

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
