import { z } from "zod";

export const SubmissionSearchSchema = z.object({
  q: z.string().optional(),
  sortBy: z.string().default("title"),
  order: z.enum(["asc", "desc"]).default("desc"),
  scores: z.enum(["great", "good", "average", "bad", "spam"]).optional(),
  first: z.number().default(10),
  page: z.number().default(1),
  serviceRequestId: z.string().optional(),
});

export type SubmissionSearch = z.infer<typeof SubmissionSearchSchema>;
