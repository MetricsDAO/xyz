import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { validateDate, validateTime } from "~/utils/date";
import { EthAddressSchema } from "./address";

export const ChallengeSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }).min(1, "Required"),
  description: z.string({ description: "The description of the service request." }).min(1, "Required"),
  laborMarketAddress: EthAddressSchema,
});

const inputDateSchema = z.string().refine((d) => {
  return validateDate(d);
});

const inputTimeSchema = z.string().refine((t) => {
  return validateTime(t);
});

// Form input
export const ChallengeNewSchema = ChallengeSchema.omit({ id: true, laborMarketAddress: true }).extend({
  language: z.enum(["english", "spanish"]),
  projects: z.enum(["ethereum", "solana"]),
  startDate: inputDateSchema,
  startTime: inputTimeSchema,
  endDate: inputDateSchema,
  endTime: inputTimeSchema,
  reviewEndDate: inputDateSchema,
  reviewEndTime: inputTimeSchema,
  rewardToken: z.enum(["ETH"]),
  rewardPool: z.string(),
});

// Contract input
export const ChallengePreparedSchema = ChallengeSchema.pick({ laborMarketAddress: true }).extend({
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
    rewardToken: "ETH",
    rewardPool: "5",
  };
}

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeNew = z.infer<typeof ChallengeNewSchema>;
export type ChallengePrepared = z.infer<typeof ChallengePreparedSchema>;
export type ChallengeSearch = z.infer<typeof ChallengeSearchSchema>;
