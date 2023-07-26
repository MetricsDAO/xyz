import { z } from "zod";
import { zfd } from "zod-form-data";
import { fromUnixTimestamp } from "~/utils/date";
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
    requester: EvmAddressSchema,
    requestId: z.string(),
    signalExp: z.coerce.number().transform((s) => fromUnixTimestamp(s)),
    submissionExp: z.coerce.number().transform((s) => fromUnixTimestamp(s)),
    enforcementExp: z.coerce.number().transform((e) => fromUnixTimestamp(e)),
    providerLimit: z.coerce.number().int(),
    reviewerLimit: z.coerce.number().int(),
    pTokenProviderTotal: z.string(),
    pTokenReviewerTotal: z.string(),
    pTokenProvider: EvmAddressSchema,
    pTokenReviewer: EvmAddressSchema,
    uri: z.string(),
  })
);
export type ServiceRequestConfig = z.infer<typeof ServiceRequestConfigSchema>;

export const ServiceRequestBaseSchema = z.object({
  id: z.string(),
  laborMarketAddress: EvmAddressSchema,
  blockTimestamp: z.date(),
  configuration: ServiceRequestConfigSchema,
});
export type ServiceRequestBase = z.infer<typeof ServiceRequestBaseSchema>;

/**
 * Contains all aggregated and index-specific data for a LaborMarket.
 */
export const ServiceRequestIndexDataSchema = z.object({
  indexedAt: z.date().default(() => new Date()),
  claimsToReview: z.array(z.object({ signaler: EvmAddressSchema, signalAmount: z.number() })),
  claimsToSubmit: z.array(z.object({ signaler: EvmAddressSchema })),
  submissionCount: z.number(),
});
export type ServiceRequestIndexData = z.infer<typeof ServiceRequestIndexDataSchema>;

/**
 * This is the canonical shape of a ServiceRequest in our system.
 */
export const ServiceRequestDocSchema = ServiceRequestBaseSchema.extend({
  appData: ServiceRequestAppDataSchema,
  indexData: ServiceRequestIndexDataSchema,
});
export type ServiceRequestDoc = z.infer<typeof ServiceRequestDocSchema>;

/**
 * For filtering labor markets.
 */
export const ServiceRequestFilterSchema = z.object({
  q: z.string().optional(),
  token: z.array(z.string()).optional(),
  project: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  laborMarket: z.string().optional(),
  exclude: z.array(EvmAddressSchema).optional(), // labor market addresses
});
export type ServiceRequestFilter = z.infer<typeof ServiceRequestFilterSchema>;

export const ServiceRequestSearchSchema = ServiceRequestFilterSchema.extend({
  sortBy: z
    .enum(["blockTimestamp", "appData.title", "configuration.submissionExp", "configuration.enforcementExp"])
    .default("configuration.submissionExp"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  first: z.coerce.number().min(1).max(100).default(100),
});

export type ServiceRequestSearch = z.infer<typeof ServiceRequestSearchSchema>;
