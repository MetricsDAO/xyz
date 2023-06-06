import type { User } from "@prisma/client";
import type { Filter, WithId } from "mongodb";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionForm } from "~/features/submission-creator/schema";
import { SubmissionFormSchema } from "~/features/submission-creator/schema";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import { oneUnitAgo, utcDate } from "~/utils/date";
import { scoreRange } from "~/utils/helpers";
import type {
  CombinedDoc,
  ShowcaseSearch,
  SubmissionConfig,
  SubmissionContract,
  SubmissionDoc,
  SubmissionSearch,
  SubmissionWithReviewsDoc,
} from "./schemas";
import { SubmissionContractSchema } from "./schemas";

/**
 * Returns a SubmissionDoc from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getSubmission(address: EvmAddress, id: string) {
  return await mongo.submissions.findOne({ id, laborMarketAddress: address });
}

/**
 * Returns an array of SubmissionDoc for a given Service Request.
 */
export const searchSubmissions = async (params: SubmissionSearch) => {
  return mongo.submissions
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of Submissions that match a given SubmissionSearch.
 * @param {FilterParams} params - The search parameters.
 * @returns {number} - The number of submissions that match the search.
 */
export const countSubmissions = async (params: FilterParams) => {
  return mongo.submissions.countDocuments(searchParams(params));
};

type FilterParams = Pick<
  SubmissionSearch,
  "score" | "q" | "laborMarketAddress" | "serviceRequestId" | "serviceProvider"
>;

/**
 * Convenience function to share the search parameters between search and count.
 * @param {SubmissionSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: FilterParams): Parameters<typeof mongo.submissions.find>[0] => {
  return {
    ...(params.laborMarketAddress ? { laborMarketAddress: params.laborMarketAddress } : {}),
    ...(params.serviceRequestId ? { serviceRequestId: params.serviceRequestId } : {}),
    ...(params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {}),
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
    ...(params.score
      ? {
          $or: [
            params.score.includes("spam") ? { "score.avg": scoreRange("spam") } : null,
            params.score.includes("bad") ? { "score.avg": scoreRange("bad") } : null,
            params.score.includes("average") ? { "score.avg": scoreRange("average") } : null,
            params.score.includes("good") ? { "score.avg": scoreRange("good") } : null,
            params.score.includes("stellar") ? { "score.avg": scoreRange("stellar") } : null,
          ].filter(Boolean) as Filter<WithId<SubmissionDoc>>[], // type assertion,
        }
      : {}),
  };
};

/**
 * Create a new SubmissionDoc from a TracerEvent.
 */
export const createSubmission = async (
  laborMarketAddress: EvmAddress,
  blockTimestamp: Date,
  configuration: SubmissionConfig
) => {
  const appData = await fetchIpfsJson(configuration.uri);

  return await mongo.submissions.insertOne({
    id: configuration.submissionId,
    laborMarketAddress,
    serviceRequestId: configuration.requestId,
    indexedAt: new Date(),
    configuration,
    appData,
    blockTimestamp,
  });
};

/**
 * Prepare a new Submission for writing to chain
 * @param {string} laborMarketAddress - The labor market address the submission belongs to
 * @param {string} serviceRequestId - The service request the submission belongs to
 * @param {SubmissionForm} form - the service request the submission is being submitted for
 * @returns {SubmissionContract} - The prepared submission
 */
export const prepareSubmission = async (
  user: User,
  laborMarketAddress: string,
  serviceRequestId: string,
  form: SubmissionForm
): Promise<SubmissionContract> => {
  const metadata = SubmissionFormSchema.parse(form); // Prune extra fields from form
  const cid = await uploadJsonToIpfs(user, metadata, metadata.title);
  // parse for type safety
  const contractData = SubmissionContractSchema.parse({
    laborMarketAddress: laborMarketAddress,
    serviceRequestId: serviceRequestId,
    uri: cid,
  });
  return contractData;
};

/**
 * Returns an array of Submissions with their Reviews for a given Service Request.
 */
export const searchSubmissionsWithReviews = async (params: SubmissionSearch) => {
  return mongo.submissions
    .aggregate<SubmissionWithReviewsDoc>([
      {
        $match: searchParams(params),
      },
      {
        $lookup: {
          from: "reviews",
          let: {
            sr_id: "$serviceRequestId",
            m_addr: "$laborMarketAddress",
            s_id: "$id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$submissionId", "$$s_id"] },
                    { $eq: ["$id", "$$sr_id"] },
                    { $eq: ["$laborMarketAddress", "$$m_addr"] },
                  ],
                },
              },
            },
          ],
          as: "reviews",
        },
      },
    ])
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Returns an array of Submissions with their Service Request and LaborMarket sorted by score
 */
export const searchSubmissionsShowcase = async (params: ShowcaseSearch) => {
  return mongo.submissions
    .aggregate<CombinedDoc>(searchShowcasePipline(params))
    .sort({ blockTimestamp: -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of Submissions that match a given ShowcaseSearch.
 * @param {ShowcaseSearch} params - The search parameters.
 * @returns {number} - The number of submissions that match the search.
 */
export const countShowcases = async (params: ShowcaseSearch) => {
  const submissions = await mongo.submissions
    .aggregate([
      ...searchShowcasePipline(params),
      {
        $count: "match_count",
      },
    ])
    .toArray();
  return submissions[0]?.match_count ?? 0;
};

const searchShowcasePipline = (params: ShowcaseSearch) => {
  const timeframe = oneUnitAgo(params.timeframe);
  return [
    {
      $match: {
        $and: [
          { "score.avg": { $gte: 70 } },
          //params.q ? { $text: { $search: params.q, $language: "english" } } : {},
        ],
      },
    },
    {
      $lookup: {
        from: "serviceRequests",
        let: {
          sr_id: "$serviceRequestId",
          m_addr: "$laborMarketAddress",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$id", "$$sr_id"] }, { $eq: ["$laborMarketAddress", "$$m_addr"] }],
              },
            },
          },
        ],
        as: "sr",
      },
    },
    {
      $lookup: {
        from: "laborMarkets",
        let: {
          m_addr: "$laborMarketAddress",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$address", "$$m_addr"] }],
              },
            },
          },
        ],
        as: "lm",
      },
    },
    {
      $unwind: "$sr",
    },
    {
      $unwind: "$lm",
    },
    {
      $match: {
        $and: [
          { "sr.configuration.enforcementExp": { $lt: utcDate() } },
          { "lm.appData.type": "analyze" },
          params.marketplace ? { "lm.address": { $in: params.marketplace } } : {},
          params.score ? { "score.avg": scoreRange(params.score) } : {},
          { blockTimestamp: { $gte: timeframe } },
          params.project ? { "sr.appData.projectSlugs": { $in: params.project } } : {},
        ],
      },
    },
  ];
};
