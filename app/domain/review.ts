import { z } from "zod";

export const ReviewSearchSchema = z.object({
  sortBy: z.enum(["createdAt"]).default("createdAt").describe("Sort by column."),
  order: z.enum(["asc", "desc"]).default("desc"),
  score: z
    .array(z.enum(["great", "good", "average", "bad", "spam"]))
    .optional()
    .describe("Filter by Likert score."),
  first: z.number().default(10),
  page: z.number().default(1),
  submissionId: z.string().optional(),
});

export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;
