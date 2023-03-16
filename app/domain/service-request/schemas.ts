import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { fromUnixTimestamp, parseDatetime, validateDate, validateTime } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import { EvmAddressSchema } from "../address";
import { arrayToObject } from "../shared/utils";

/**
 * AppData is any data that isn't stored by the contract directly but is stored in IPFS instead.
 */
export const ServiceRequestAppDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(["english", "spanish"]),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
});
export type ServiceRequestAppData = z.infer<typeof ServiceRequestAppDataSchema>;

/**
 * Normalizes the `configuration` method from the ServiceRequest contract so both the contract and the index can use the same type.
 */
export const ServiceRequestConfigSchema = z.preprocess(
  arrayToObject,
  z.object({
    serviceRequester: EvmAddressSchema,
    pToken: EvmAddressSchema,
    pTokenQ: z.coerce.string(),
    signalExp: z.coerce.number().transform((s) => fromUnixTimestamp(s)),
    submissionExp: z.coerce.number().transform((s) => fromUnixTimestamp(s)),
    enforcementExp: z.coerce.number().transform((e) => fromUnixTimestamp(e)),
    uri: z.string(),
  })
);
export type ServiceRequestConfig = z.infer<typeof ServiceRequestConfigSchema>;

/**
 * Contains all aggregated and index-specific data for a LaborMarket.
 */
export const ServiceRequestIndexDataSchema = z.object({
  createdAtBlockTimestamp: z.date(),
  indexedAt: z.date().default(() => new Date()),
  claimsToReview: z.array(z.object({ signaler: EvmAddressSchema, signalAmount: z.number() })),
  claimsToSubmit: z.array(z.object({ signaler: EvmAddressSchema, signalAmount: z.number() })),
  submissionCount: z.number(),
});

export type ServiceRequestIndexData = z.infer<typeof ServiceRequestIndexDataSchema>;

/**
 * This is the canonical shape of a ServiceRequest in our system.
 * Data stored both in the database and the contract/ipfs should match this shape.
 */
export const ServiceRequestSchema = z.object({
  id: z.string(),
  laborMarketAddress: EvmAddressSchema,
  appData: ServiceRequestAppDataSchema,
  configuration: ServiceRequestConfigSchema,
});
export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;

/**
 * This is the same as the ServiceRequest but with additional index-specific data.
 */
export const ServiceRequestWithIndexDataSchema = ServiceRequestSchema.merge(ServiceRequestIndexDataSchema);
export type ServiceRequestWithIndexData = z.infer<typeof ServiceRequestWithIndexDataSchema>;

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

function validDeadlines(reviewDate: string, reviewTime: string, submitDate: string, submitTime: string) {
  return parseDatetime(reviewDate, reviewTime) > parseDatetime(submitDate, submitTime);
}

export const ServiceRequestFormSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    language: z.enum(["english", "spanish"]),
    projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
    endDate: InputDateSchema,
    endTime: InputTimeSchema,
    reviewEndDate: InputDateSchema,
    reviewEndTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardPool: TokenAmountSchema,
  })
  .refine((data) => validDeadlines(data.reviewEndDate, data.reviewEndTime, data.endDate, data.endTime), {
    message: "Review deadline cannot be before submission deadline.",
    path: ["reviewEndTime"],
  });

export const ServiceRequestMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.enum(["english", "spanish"]),
  projectSlugs: z.array(z.string()),
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
  createdAtBlockTimestamp: z.coerce.string(),
  indexedAt: z.coerce.string(),
  configuration: z.object({
    serviceRequester: EvmAddressSchema,
    pToken: EvmAddressSchema,
    pTokenQ: z.string(),
    signalExp: z.coerce.string(),
    submissionExp: z.coerce.string(),
    enforcementExp: z.coerce.string(),
    uri: z.string(),
  }),
  submissionCount: z.coerce.string(),
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

/**
 * For filtering labor markets.
 */
export const ServiceRequestFilterSchema = z.object({
  q: z.string().optional(),
  token: z.array(z.string()).optional(),
  project: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
});
export type ServiceRequestFilter = z.infer<typeof ServiceRequestFilterSchema>;

export const ServiceRequestSearchSchema = ServiceRequestFilterSchema.extend({
  laborMarket: z.string().optional(),
  sortBy: z
    .enum(["createdAtBlockTimestamp", "appData.title", "configuration.submissionExp", "configuration.enforcementExp"])
    .default("createdAtBlockTimestamp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  first: z.coerce.number().min(1).max(100).default(12),
});

// export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;
export type ServiceRequestForm = z.infer<typeof ServiceRequestFormSchema>;
export type ServiceRequestContract = z.infer<typeof ServiceRequestContractSchema>;
export type ServiceRequestSearch = z.infer<typeof ServiceRequestSearchSchema>;
export type ServiceRequestDoc = z.infer<typeof ServiceRequestDocSchema>;
