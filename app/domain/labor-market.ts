import { z } from "zod";
import { zfd } from "zod-form-data";
import { EthAddressSchema } from "./address";
// Main LaborMarket schema.
export const LaborMarketSchema = z.object({
  address: z.string({ description: "The address of the labor market on-chain." }),
  title: z.string({ description: "Title of the labor market." }).min(1, "Required"),
  description: z.string({ description: "Description of the labor market." }).min(1, "Required"),
  type: z.enum(["brainstorm", "analyze"], { description: "Type of the labor market (MDAO specific)." }),
  launchAccess: z.enum(["delegates", "anyone"], {
    description: "Can (anyone) launch a requests or only badge owners (delegates).",
  }),
  launchBadgerAddress: z.string({ description: "Badger Address of the badge needed to launch a request." }).optional(),
  launchBadgerTokenId: z.string({ description: "Token ID of the badge needed to launch a request." }).optional(),
  rewardCurveAddress: z.string({ description: "Address of the reward curve contract on-chain." }).min(1, "Required"),
  submitRepMin: zfd.numeric(z.number({ description: "Minimum xMETRIC needed to submit a request." })),
  submitRepMax: zfd.numeric(z.number({ description: "Maximum xMETRIC allowed to submit a request." })),
  // reviewBadgerAddress: z.string({ description: "Badger Address of the badge needed to review a request." }),
  reviewBadgerAddress: EthAddressSchema,
  reviewBadgerTokenId: z
    .string({ description: "Token ID of the badge needed to review a request." })
    .min(1, "Required"),
  tokenSymbols: zfd.repeatable(z.array(z.string(), { description: "List of reward tokens." }).min(1, "Required")),
  projectIds: zfd.repeatable(z.array(z.string(), { description: "List of project IDs." }).min(1, "Required")),
  sponsorAddress: z.string({ description: "ID of the user who sponsored it." }),
});

// The properties of a LaborMarket that live off-chain (e.g IPFS). These are properties that are specific to the MDAO app.
export const LaborMarketMetaSchema = LaborMarketSchema.pick({
  title: true,
  description: true,
  type: true,
  projectIds: true,
  rewardTokens: true,
});

// Schema for a new labor market.
export const LaborMarketNewSchema = LaborMarketSchema.omit({
  address: true,
  sponsorAddress: true,
});

// Schema for a labor market with an IPFS CID.
export const LaborMarketPreparedSchema = LaborMarketNewSchema.extend({ ipfsHash: z.string() });

// Used for searching and filtering marketplaces.
export const LaborMarketSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z.enum(["title", "serviceRequests"]).default("title").describe("Sort by column."),
  type: z.enum(["brainstorm", "analyze"]).describe("Type of the labor market (MDAO specific)."),
  order: z.enum(["asc", "desc"]).default("desc").describe("Order of the results."),
  project: z.array(z.string()).optional().describe("Project IDs to filter by."),
  token: z.array(z.string()).optional().describe("Token symbols to filter by."),
  page: z.number().min(1).default(1).describe("Page number."),
  first: z.number().min(1).max(100).default(12).describe("The number of results to return."),
});

export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketNew = z.infer<typeof LaborMarketNewSchema>;
export type LaborMarketPrepared = z.infer<typeof LaborMarketPreparedSchema>;
export type LaborMarketMeta = z.infer<typeof LaborMarketMetaSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
