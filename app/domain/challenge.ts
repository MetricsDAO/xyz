import { z } from "zod";

export const ChallengeSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }),
  description: z.string({ description: "The description of the service request." }),
  laborMarketAddress: z.string({ description: "The address of the labor market on-chain." }),
  submissions: z.array(z.string(), { description: "The list of submissions." }),
});

export const ChallengeSearchSchema = z.object({
  page: z.number().default(1),
  laborMarket: z.string().optional(),
  q: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.string().optional(),
  token: z.string().optional(),
  project: z.string().optional(),
  first: z.number().default(12),
});

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeSearch = z.infer<typeof ChallengeSearchSchema>;
