import type { z } from "zod";
import { ReviewDocSchema } from "../review/schemas";
import { SubmissionDocSchema } from "../submission/schemas";

export const ReviewWithSubmissionSchema = ReviewDocSchema.extend({
  s: SubmissionDocSchema,
});

export type ReviewWithSubmission = z.infer<typeof ReviewWithSubmissionSchema>;
