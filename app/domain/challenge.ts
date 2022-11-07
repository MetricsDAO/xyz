import { z } from "zod";
import { LaborMarketSchema } from "./labor-market";

export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sponsor: z.string(),
  status: z.enum(["pending", "active", "review", "closed"]),
  payCurve: z.enum(["flat"]),
  programId: z.string(),
  marketplace: LaborMarketSchema,
});

export const ChallengeSearchSchema = z.object({
  page: z.number().default(1).optional(),
  q: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.string().optional(),
  token: z.string().optional(),
  project: z.string().optional(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeSearch = z.infer<typeof ChallengeSearchSchema>;
