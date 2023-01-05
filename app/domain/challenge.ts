import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { validateDate, validateTime } from "~/utils/date";
import { parseTokenAmount } from "~/utils/helpers";
import { EthAddressSchema } from "./address";

export const ChallengeSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }).min(1, "Required"),
  description: z.string({ description: "The description of the service request." }).min(1, "Required"),
  laborMarketAddress: EthAddressSchema,
  createdAt: z.date({ description: "The date the service request was created." }),
});

const TokenAmountSchema = z.string().refine((r) => {
  try {
    parseTokenAmount(r);
    return true;
  } catch (e) {
    return false;
  }
}, "Invalid amount");

const InputDateSchema = z.string().refine((d) => {
  return validateDate(d);
});

const InputTimeSchema = z.string().refine((t) => {
  return validateTime(t);
});

// Form input
export const ChallengeNewSchema = ChallengeSchema.omit({ id: true, laborMarketAddress: true, createdAt: true }).extend({
  language: z.enum(["english", "spanish"]),
  projects: z.enum(["ethereum", "solana"]),
  startDate: InputDateSchema,
  startTime: InputTimeSchema,
  endDate: InputDateSchema,
  endTime: InputTimeSchema,
  reviewEndDate: InputDateSchema,
  reviewEndTime: InputTimeSchema,
  rewardToken: EthAddressSchema,
  rewardPool: TokenAmountSchema,
});

// Contract input
export const ChallengePreparedSchema = ChallengeSchema.pick({ laborMarketAddress: true }).extend({
  pTokenAddress: EthAddressSchema,
  pTokenId: z.number(),
  pTokenQuantity: TokenAmountSchema,
  signalExpiration: z.date(),
  submissionExpiration: z.date(),
  enforcementExpiration: z.date(),
  uri: z.string(),
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

// Generate a fake Challenge for testing using faker.
export function fakeChallengeNew(): ChallengeNew {
  const startDate = faker.date.soon();
  const reviewDate = faker.date.future();
  const endDate = faker.date.between(startDate, reviewDate);

  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(2),
    language: "english",
    projects: "ethereum",
    startDate: dayjs(startDate).format("YYYY-MM-DD"),
    startTime: dayjs(startDate).format("HH:mm"),
    endDate: dayjs(endDate).format("YYYY-MM-DD"),
    endTime: dayjs(endDate).format("HH:mm"),
    reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
    reviewEndTime: dayjs(reviewDate).format("HH:mm"),
    rewardToken: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc",
    rewardPool: "0.000000000000000001",
  };
}

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeNew = z.infer<typeof ChallengeNewSchema>;
export type ChallengePrepared = z.infer<typeof ChallengePreparedSchema>;
export type ChallengeSearch = z.infer<typeof ChallengeSearchSchema>;
