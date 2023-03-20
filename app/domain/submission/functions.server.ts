import type { User } from "@prisma/client";
import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionForm } from "~/features/submission-creator/schema";
import { SubmissionFormSchema } from "~/features/submission-creator/schema";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { oneUnitAgo, utcDate } from "~/utils/date";
import type {
  CombinedDoc,
  RewardsSearch,
  ShowcaseSearch,
  SubmissionContract,
  SubmissionDoc,
  SubmissionSearch,
  SubmissionWithReviewsDoc,
  SubmissionWithServiceRequest,
} from "./schemas";
import { SubmissionContractSchema, SubmissionDocSchema, SubmissionWithServiceRequestSchema } from "./schemas";

/**
 * Returns a SubmissionDoc from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedSubmission(
  address: EvmAddress,
  id: string,
  event?: TracerEvent
): Promise<SubmissionDoc> {
  const doc = await mongo.submissions.findOne({ id, laborMarketAddress: address });
  if (!doc) {
    await indexSubmission(address, id, event);
    return getIndexedSubmission(address, id, event);
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

type FilterParams = Pick<SubmissionSearch, "laborMarketAddress" | "serviceRequestId" | "serviceProvider">;

/**
 * Convenience function to share the search parameters between search and count.
 * @param {SubmissionSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: FilterParams): Parameters<typeof mongo.submissions.find>[0] => {
  return {
    valid: true,
    ...(params.laborMarketAddress ? { laborMarketAddress: params.laborMarketAddress } : {}),
    ...(params.serviceRequestId ? { serviceRequestId: params.serviceRequestId } : {}),
    ...(params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {}),
    // ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
  };
};

/**
 * Finds a Submission by its ID.
 * @param {String} id - The ID of the submission.
 * @returns - The Submission or null if not found.
 */
export const findSubmission = async (id: string, laborMarketAddress: EvmAddress) => {
  return mongo.submissions.findOne({ valid: true, laborMarketAddress, id });
};

/**
 * Counts the number of Submissions on a particular service request.
 * @param {SubmissionSearch} params - The search parameters.
 * @returns {number} - The number of submissions that match the search.
 */
export const countSubmissionsOnServiceRequest = async (serviceRequestId: string) => {
  return mongo.submissions.countDocuments({ serviceRequestId, valid: true });
};

/**
 * Create a new SubmissionDoc from a TracerEvent.
 */
export const indexSubmission = async (address: EvmAddress, id: string, event?: TracerEvent) => {
  const contractAddress = getAddress(address);
  const contract = LaborMarket__factory.connect(contractAddress, nodeProvider);

  const submission = await contract.serviceSubmissions(id, { blockTag: event?.block.number });
  const appData = await fetchIpfsJson(submission.uri)
    .then(SubmissionFormSchema.parse)
    .catch(() => null);

  const isValid = appData !== null;
  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<SubmissionDoc, "createdAtBlockTimestamp"> = {
    id: id,
    laborMarketAddress: contractAddress,
    serviceRequestId: submission.requestId.toString(),
    valid: isValid,
    indexedAt: new Date(),
    configuration: {
      serviceProvider: submission.serviceProvider as `0x${string}`,
      uri: submission.uri,
    },
    appData,
  };

  const createdAtBlockTimestamp = event?.block.timestamp ? new Date(event?.block.timestamp) : new Date();

  //log this event in user activity collection
  mongo.userActivity.insertOne({
    groupType: "Submission",
    eventType: {
      eventType: "RequestFulfilled",
      config: {
        laborMarketAddress: contractAddress,
        requestId: doc.serviceRequestId,
        submissionId: id,
        title: appData?.title ?? "",
      },
    },
    iconType: "submission",
    actionName: "Submission",
    userAddress: doc.configuration.serviceProvider,
    createdAtBlockTimestamp: createdAtBlockTimestamp,
    indexedAt: new Date(),
  });

  if (isValid) {
    await mongo.serviceRequests.updateOne(
      { laborMarketAddress: doc.laborMarketAddress, id: doc.serviceRequestId },
      {
        $inc: {
          submissionCount: 1,
        },
      }
    );
  }

  return mongo.submissions.updateOne(
    { id: doc.id, laborMarketAddress: doc.laborMarketAddress },
    {
      $set: doc,
      $setOnInsert: { createdAtBlockTimestamp: createdAtBlockTimestamp },
    },
    { upsert: true }
  );
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
        $match: {
          $and: [
            params.laborMarketAddress ? { laborMarketAddress: params.laborMarketAddress } : {},
            params.serviceRequestId ? { serviceRequestId: params.serviceRequestId } : {},
            params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {},
            //params.q ? { $text: { $search: params.q, $language: "english" } } : {},
          ],
        },
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
 * Returns an array of Submissions with their Service Request and LaborMarket
 */

export const searchUserSubmissions = async (params: RewardsSearch): Promise<SubmissionWithServiceRequest[]> => {
  const submissionsDocs = await mongo.submissions
    .aggregate([
      {
        $match: {
          $and: [
            params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {},
            // params.q ? { $text: { $search: params.q, $language: "english" } } : {},
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
                  $and: [
                    { $eq: ["$id", "$$sr_id"] },
                    { $eq: ["$laborMarketAddress", "$$m_addr"] },
                    params.token
                      ? {
                          serviceRequestRewardPools: { $elemMatch: { "$configuration.pToken": { $in: params.token } } },
                        }
                      : {},
                  ],
                },
              },
            },
          ],
          as: "sr",
        },
      },
      {
        $unwind: "$sr",
      },
      ...(params.isPastEnforcementExpiration
        ? [
            {
              $match: {
                $and: [{ "sr.configuration.enforcementExp": { $lt: utcDate() } }],
              },
            },
          ]
        : []),
    ])
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();

  return z.array(SubmissionWithServiceRequestSchema).parse(submissionsDocs);
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
            { "score.avg": { $gte: 75 } },
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
            params.score ? { "score.avg": { $gte: params.score } } : {},
            params.score ? { "score.avg": { $lt: params.score + 25 } } : {},
            { createdAtBlockTimestamp: { $gte: timeframe } },
            params.project ? { "sr.appData.projectSlugs": { $in: params.project } } : {},
          ],
        },
      },
    ])
    .sort({ createdAtBlockTimestamp: -1 })
    .limit(5 + params.count)
    .toArray();
};
