import { z } from "zod";

export const LaborMarketSchema = z.object({
  address: z.string(),
  title: z.string(),
  description: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  privacy: z.enum(["public", "private"]),
  authorRepMin: z.number(),
  authorRepMax: z.number(),
  reviewerRepMin: z.number(),
  reviewerRepMax: z.number(),
  rewardCurve: z.number(),
  rewardTokens: z.array(z.string()),
  reviewMethod: z.enum(["likert"]),
  rewardPool: z.number(),
  reviewPriorityFactor: z.enum(["cheap", "normal", "aggressive"]),
  project: z.string(),
  entryCost: z.number(),
  topicCount: z.number(),
});

export const LaborMarketSearchSchema = z.object({
  page: z.number().default(1).optional(),
  q: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.string().optional(),
  token: z.string().optional(),
  project: z.string().optional(),
});

export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
