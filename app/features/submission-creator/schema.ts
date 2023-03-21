import { z } from "zod";

export const SubmissionFormSchema = z.object({
  title: z.string().min(1, "Required"),
  submissionUrl: z.string().min(1, "Required"),
});

export type SubmissionForm = z.infer<typeof SubmissionFormSchema>;
