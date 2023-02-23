import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { validateDate, validateTime } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import { EvmAddressSchema } from "./address";

export const ServiceRequestSchema = z.object({
  id: z.string({ description: "The id of the service request." }),
  title: z.string({ description: "The title of the service request." }).min(1, "Required"),
  description: z.string({ description: "The description of the service request." }).min(1, "Required"),
  language: z.enum(["english", "spanish"]),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
  laborMarketAddress: EvmAddressSchema,
  createdAt: z.date({ description: "The date the service request was created." }),
});

const DateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const TokenAmountSchema = z.string().refine((r) => {
  try {
    toTokenAmount(r);
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

export const ServiceRequestFormSchema = ServiceRequestSchema.pick({
  title: true,
  description: true,
  language: true,
  projectSlugs: true,
}).extend({
  endDate: InputDateSchema,
  endTime: InputTimeSchema,
  reviewEndDate: InputDateSchema,
  reviewEndTime: InputTimeSchema,
  rewardToken: EvmAddressSchema,
  rewardPool: TokenAmountSchema,
});

export const ServiceRequestMetaSchema = ServiceRequestSchema.pick({
  title: true,
  description: true,
  language: true,
  projectSlugs: true,
});

export const ServiceRequestContractSchema = ServiceRequestSchema.pick({
  laborMarketAddress: true,
}).extend({
  pTokenAddress: EvmAddressSchema,
  pTokenQuantity: TokenAmountSchema,
  signalExpiration: DateSchema,
  submissionExpiration: DateSchema,
  enforcementExpiration: DateSchema,
  uri: z.string(),
});

/**
 * The schema for a ServiceRequestDocument. This should be identical to how the document is stored in mongo.
 */
export const ServiceRequestDocSchema = z.object({
  id: z.string().describe("The request id"),
  laborMarketAddress: EvmAddressSchema,
  valid: z.boolean(),
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date(),
  configuration: z.object({
    requester: EvmAddressSchema,
    pToken: EvmAddressSchema,
    pTokenQuantity: z.string(),
    signalExpiration: z.date(),
    submissionExpiration: z.date(),
    enforcementExpiration: z.date(),
    uri: z.string(),
  }),
  submissionCount: z.number(),
  claimsToReview: z.array(
    z.object({
      signaler: EvmAddressSchema,
      signalAmount: z.string(),
    })
  ),
  claimsToSubmit: z.array(
    z.object({
      signaler: EvmAddressSchema,
      signalAmount: z.string(),
    })
  ),
  appData: ServiceRequestMetaSchema.nullable(),
});

// Generate a fake Service Request for testing using faker.
export function fakeServiceRequestFormData(): ServiceRequestForm {
  const startDate = faker.date.soon();
  const reviewDate = faker.date.future();
  const endDate = faker.date.between(startDate, reviewDate);

  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(2),
    language: "english",
    projectSlugs: [],
    endDate: dayjs(endDate).format("YYYY-MM-DD"),
    endTime: dayjs(endDate).format("HH:mm"),
    reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
    reviewEndTime: dayjs(reviewDate).format("HH:mm"),
    rewardToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    rewardPool: "0.000001",
  };
}

export const ServiceRequestSearchSchema = z.object({
  page: z.number().default(1),
  laborMarket: z.string().optional(),
  q: z.string().optional(),
  sortBy: z
    .enum([
      "createdAtBlockTimestamp",
      "appData.title",
      "configuration.submissionExpiration",
      "configuration.enforcementExpiration",
    ])
    .default("createdAtBlockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  token: z.string().optional(),
  project: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  first: z.number().default(12),
});

export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;
export type ServiceRequestForm = z.infer<typeof ServiceRequestFormSchema>;
export type ServiceRequestContract = z.infer<typeof ServiceRequestContractSchema>;
export type ServiceRequestSearch = z.infer<typeof ServiceRequestSearchSchema>;
export type ServiceRequestDoc = z.infer<typeof ServiceRequestDocSchema>;
