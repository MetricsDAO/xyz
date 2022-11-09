import { z } from "zod";

// Main LaborMarket schema.
export const LaborMarketSchema = z.object({
  address: z.string({ description: "The address of the labor market on-chain." }),
  title: z.string({ description: "Title of the labor market." }),
  description: z.string({ description: "Description of the labor market." }),
  type: z.enum(["brainstorm", "analyze"], { description: "Type of the labor market (MDAO specific)." }),
  launchAccess: z.enum(["delegates", "anyone"], {
    description: "Can (anyone) launch a requests or only badge owners (delegates).",
  }),
  launchBadgerAddress: z.string({ description: "Badger Address of the badge needed to launch a request." }).optional(),
  launchBadgerTokenId: z.string({ description: "Token ID of the badge needed to launch a request." }).optional(),
  rewardCurveAddress: z.string({ description: "Address of the reward curve contract on-chain." }),
  submitRepMin: z.number({ description: "Minimum xMETRIC needed to submit a request." }),
  submitRepMax: z.number({ description: "Maximum xMETRIC allowed to submit a request." }),
  reviewBadgerAddress: z.string({ description: "Badger Address of the badge needed to review a request." }),
  reviewBadgerTokenId: z.string({ description: "Token ID of the badge needed to review a request." }),
  tokenSymbols: z.array(z.string(), { description: "List of reward tokens." }),
  projectIds: z.array(z.string(), { description: "List of project IDs." }),
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
export const LaborMarketNewSchema = LaborMarketSchema.omit({ address: true });

// Used for searching and filtering marketplaces.
export const LaborMarketSearchSchema = z.object({
  q: z.string().optional().describe("Search query."),
  sortBy: z
    .enum(["title", "serviceRequests"])
    .default("title")
    .describe("Sort by column."),
  type: z.enum(["brainstorm", "analyze"]).describe("Type of the labor market (MDAO specific)."),
  order: z.enum(["asc", "desc"]).default("desc").describe("Order of the results."),
  project: z.string().optional().describe("Project IDs to filter by."),
  token: z.string().optional().describe("Token symbols to filter by."),
  page: z.number().min(1).default(1).describe("Page number."),
  first: z.number().min(1).max(100).default(12).describe("The number of results to return."),
});

export type LaborMarket = z.infer<typeof LaborMarketSchema>;
export type LaborMarketNew = z.infer<typeof LaborMarketNewSchema>;
export type LaborMarketMeta = z.infer<typeof LaborMarketMetaSchema>;
export type LaborMarketSearch = z.infer<typeof LaborMarketSearchSchema>;
