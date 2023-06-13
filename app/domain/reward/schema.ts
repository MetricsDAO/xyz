import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const RewardsSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["sr[0].appData.title", "blockTimestamp"]).default("blockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  first: z.number().default(15),
  page: z.number().default(1),
  token: z.array(z.string()).optional(),
  isPastEnforcementExpiration: z.boolean().default(true),
  fulfiller: EvmAddressSchema.optional(),
});

export const RewardedSubmissionSchema = z.object({
  payoutAddress: EvmAddressSchema.optional(),
});

export const RewardedSubmissionsSchema = z.array(RewardedSubmissionSchema);

const IOUTokenSchema = z.object({
  id: z.string(),
  tokenName: z.string(),
  chain: z.string(),
  fireblocksTokenName: z.string(),
  decimals: z.number(),
  balance: z.string(),
});

export const IOUData = z.object({
  metadata: z.array(IOUTokenSchema),
  signature: z.string(),
});

export type RewardsSearch = z.infer<typeof RewardsSearchSchema>;
export type RewardedSubmission = z.infer<typeof RewardedSubmissionSchema>;
export type IOUToken = z.infer<typeof IOUTokenSchema>;
