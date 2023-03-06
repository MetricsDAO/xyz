import type { User } from "@prisma/client";
import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type {
  RewardsSearch,
  SubmissionContract,
  SubmissionDoc,
  SubmissionForm,
  SubmissionSearch,
  SubmissionWithReviewsDoc,
  CombinedDoc,
} from "~/domain/submission";
import { CombinedDocSchema } from "~/domain/submission";
import { SubmissionEventSchema } from "~/domain/submission";
import { SubmissionContractSchema, SubmissionFormSchema } from "~/domain/submission";
import { utcDate } from "~/utils/date";
import { fetchIpfsJson, uploadJsonToIpfs } from "./ipfs.server";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";

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
export const findSubmission = async (id: string, laborMarketAddress: string) => {
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
export const indexSubmission = async (event: TracerEvent) => {
  const contract = LaborMarket__factory.connect(event.contract.address, nodeProvider);
  const { submissionId, requestId } = SubmissionEventSchema.parse(event.decoded.inputs);
  const submission = await contract.serviceSubmissions(submissionId, { blockTag: event.block.number });
  const appData = await fetchIpfsJson(submission.uri)
    .then(SubmissionFormSchema.parse)
    .catch(() => null);

  const isValid = appData !== null;
  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<SubmissionDoc, "createdAtBlockTimestamp"> = {
    id: submissionId,
    laborMarketAddress: event.contract.address,
    serviceRequestId: requestId,
    valid: isValid,
    submissionUrl: appData?.submissionUrl ? appData.submissionUrl : null,
    indexedAt: new Date(),
    configuration: {
      serviceProvider: submission.serviceProvider,
      uri: submission.uri,
    },
    appData,
  };

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
    { $set: doc, $setOnInsert: { createdAtBlockTimestamp: new Date(event.block.timestamp) } },
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
 * Returns an array of Submissions with their Service Request and Labor Market for a given user
 */
export const searchUserSubmissions = async (params: RewardsSearch): Promise<CombinedDoc[]> => {
  const submissionsDocs = await mongo.submissions
    .aggregate([
      {
        $match: {
          $and: [
            { "configuration.serviceProvider": params.serviceProvider },
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
      /*...(params.isPastEnforcementExpiration
        ? [
            {
              $match: {
                $and: [{ "sr.configuration.enforcementExpiration": { $lt: utcDate() } }],
              },
            },
          ]
        : []),*/
      ...(params.marketplace
        ? [
            {
              $match: {
                $and: [{ "lm.address": { $in: params.marketplace } }],
              },
            },
          ]
        : []),
      ...(params.token
        ? [
            {
              $match: {
                $and: [{ "sr.configuration.pToken": { $in: params.token } }],
              },
            },
          ]
        : []),
    ])
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
  return z.array(CombinedDocSchema).parse(submissionsDocs);
};
