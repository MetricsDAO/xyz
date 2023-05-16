import type { User } from "@prisma/client";
import type { Filter, WithId } from "mongodb";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { EvmAddressSchema } from "~/domain/address";
import type { SubmissionForm } from "~/features/submission-creator/schema";
import { SubmissionFormSchema } from "~/features/submission-creator/schema";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { oneUnitAgo, utcDate } from "~/utils/date";
import { scoreRange } from "~/utils/helpers";
import type {
  CombinedDoc,
  ShowcaseSearch,
  SubmissionContract,
  SubmissionDoc,
  SubmissionSearch,
  SubmissionWithReviewsDoc,
} from "./schemas";
import { SubmissionContractSchema, SubmissionDocSchema } from "./schemas";

/**
 * Returns a SubmissionDoc from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedSubmission(address: EvmAddress, id: string): Promise<SubmissionDoc> {
  const doc = await mongo.submissions.findOne({ id, laborMarketAddress: address });
  if (!doc) {
    const newDoc = await upsertSubmission(address, id);
    invariant(newDoc, "Submission should have been indexed");
    return newDoc;
  }
  return SubmissionDocSchema.parse(doc);
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

export const handleRequestFulfilledEvent = async (event: TracerEvent) => {
  const submissionId = z.string().parse(event.decoded.inputs.submissionId);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const submission = await upsertSubmission(laborMarketAddress, submissionId, event);
  invariant(submission, "Submission should exist after upserting");

  //log this event in user activity collection
  invariant(submission.blockTimestamp, "Submission should have a block timestamp");
  await mongo.userActivity.insertOne({
    groupType: "Submission",
    eventType: {
      eventType: "RequestFulfilled",
      config: {
        laborMarketAddress: submission.laborMarketAddress,
        requestId: submission.serviceRequestId,
        submissionId: submission.id,
        title: submission.appData?.title ?? "",
      },
    },
    iconType: "submission",
    actionName: "Submission",
    userAddress: submission.configuration.serviceProvider,
    blockTimestamp: submission.blockTimestamp,
    indexedAt: new Date(),
  });

  await mongo.serviceRequests.updateOne(
    { laborMarketAddress: submission.laborMarketAddress, id: submission.serviceRequestId },
    {
      $inc: {
        submissionCount: 1,
      },
    }
  );
};

/**
 * Create a new SubmissionDoc from a TracerEvent.
 */
export const upsertSubmission = async (address: EvmAddress, id: string, event?: TracerEvent) => {
  const contract = LaborMarket__factory.connect(address, nodeProvider);

  const submission = await contract.serviceSubmissions(id, { blockTag: event?.block.number });
  const appData = await fetchIpfsJson(submission.uri)
    .then(SubmissionFormSchema.parse)
    .catch(() => null);

  if (!appData) {
    logger.warn(`Failed to fetch and parse submission app data for ${address}. Id: ${id} Skipping indexing.`);
    return null;
  }
  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: SubmissionDoc = {
    id: id,
    laborMarketAddress: address,
    serviceRequestId: submission.requestId.toString(),
    indexedAt: new Date(),
    configuration: {
      serviceProvider: EvmAddressSchema.parse(submission.serviceProvider),
      uri: submission.uri,
    },
    appData,
    blockTimestamp: event?.block.timestamp ? new Date(event?.block.timestamp) : undefined,
  };

  const res = await mongo.submissions.findOneAndUpdate(
    { id: doc.id, laborMarketAddress: doc.laborMarketAddress },
    {
      $set: doc,
    },
    { upsert: true, returnDocument: "after" }
  );

  return res.value;
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
  const timeframe = oneUnitAgo(params.timeframe);
  return mongo.submissions
    .aggregate<CombinedDoc>([
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
    ])
    .sort({ blockTimestamp: -1 })
    .limit(5 + params.count)
    .toArray();
};
