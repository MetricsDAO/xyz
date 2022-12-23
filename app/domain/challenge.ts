import { z } from "zod";
import { EthAddressSchema } from "./address";

export const ChallengeSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }).min(1, "Required"),
  description: z.string({ description: "The description of the service request." }).min(1, "Required"),
  laborMarketAddress: EthAddressSchema,
});

export const ChallengeNewSchema = ChallengeSchema.omit({ id: true }).extend({
  pTokenAddress: EthAddressSchema,
  pTokenId: z.number().describe("The id of the payment token."),
  pTokenQuantity: z.number().describe("The quantity of the payment token."),
  signalExpiration: z.date().describe("The signal deadline expiration."),
  submissionExpiration: z.date().describe("The submission deadline expiration."),
  enforcementExpiration: z.date().describe("The enforcement deadline expiration."),
  uri: z.string().describe("The uri of the service request data."),
});

export const ChallengeSearchSchema = z.object({
  page: z.number().default(1),
  laborMarket: z.string().optional(),
  q: z.string().optional(),
  sortBy: z.enum(["title"]).default("title"),
  order: z.enum(["asc", "desc"]).default("desc"),
  token: z.string().optional(),
  project: z.string().optional(),
  first: z.number().default(12),
});

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeNew = z.infer<typeof ChallengeNewSchema>;
export type ChallengeSearch = z.infer<typeof ChallengeSearchSchema>;
