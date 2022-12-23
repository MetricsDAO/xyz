import { z } from "zod";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["createdAt"]).default("createdAt").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z
    .array(z.enum([100, 75, 50, 25, 0]))
    .optional()
    .describe("Filter by Likert score."),
  first: z.number().default(10),
  page: z.number().default(1),
  submissionId: z.string().optional(),
});

export const ReviewSchema = z.object({
  score: z.array(z.enum([100, 75, 50, 25, 0])),
  requestId: z.string(),
  submissionId: z.string(),
});

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
export type ReviewPrepared = z.infer<typeof ReviewSchema>;
