import { z } from "zod";
import { EvmAddressSchema } from "./address";

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

export const RewardSchema = z.object({
  tokenAmount: z.string(),
  tokenAddress: EvmAddressSchema,
  isIou: z.boolean().optional(),
  iouSignature: z.string().optional(),
  iouClientTransactionSuccess: z.boolean().optional(), // Not to be trusted as source of truth. Used by front-end to optimistically hide the redeem button and prevent a double redeem
  iouHasRedeemed: z.boolean().optional(),
});

export const RequestPayClaimedEventSchema = z.object({
  claimer: EvmAddressSchema,
  requestId: z.string(),
  submissionId: z.string(),
  payAmount: z.string(),
  to: EvmAddressSchema,
});

export type RewardsSearch = z.infer<typeof RewardsSearchSchema>;
export type RewardedSubmission = z.infer<typeof RewardedSubmissionSchema>;
