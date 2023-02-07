import type { User } from "@prisma/client";
import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type { SubmissionContract, SubmissionDoc, SubmissionForm, SubmissionSearch } from "~/domain/submission";
import { SubmissionContractSchema, submissionMetaDataSchema } from "~/domain/submission";
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
 * @param {SubmissionSearch} params - The search parameters.
 * @returns {number} - The number of submissions that match the search.
 */
export const countSubmissions = async (params: SubmissionSearch) => {
  return mongo.submissions.countDocuments(searchParams(params));
};

/**
 * Convenience function to share the search parameters between search and count.
 * @param {SubmissionSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: SubmissionSearch): Parameters<typeof mongo.submissions.find>[0] => {
  return {
    valid: true,
    ...(params.laborMarketAddress ? { address: params.laborMarketAddress } : {}),
    ...(params.serviceRequestId ? { address: params.serviceRequestId } : {}),
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
  };
};

/**
 * Finds a Submission by its ID.
 * @param {String} id - The ID of the submission.
 * @returns - The Submission or null if not found.
 */
export const findSubmission = async (id: string, laborMarketAddress: string) => {
  return mongo.submissions.findOne({ id, address: laborMarketAddress, valid: true });
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
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const submission = await contract.serviceSubmissions(requestId, { blockTag: event.block.number });
  const appData = await fetchIpfsJson(submission.uri)
    .then(submissionMetaDataSchema.parse)
    .catch(() => null);

  const currentSubmissionCount = await countSubmissionsOnServiceRequest(requestId);

  const isValid = appData !== null;
  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<SubmissionDoc, "reviewCount"> = {
    id: (currentSubmissionCount + 1).toString(),
    laborMarketAddress: event.contract.address,
    serviceRequestId: requestId,
    valid: isValid,
    reviewed: submission.reviewed,
    submissionUrl: appData?.submissionUrl ? appData.submissionUrl : null,
    indexedAt: new Date(),
    configuration: {
      requester: submission.serviceProvider,
      uri: submission.uri,
    },
    appData,
  };

  if (isValid) {
    await mongo.serviceRequests.updateOne(
      { id: doc.serviceRequestId },
      {
        $inc: {
          submissionCount: 1,
        },
      }
    );
  }

  return mongo.submissions.updateOne(
    { id: doc.id, laborMarketAddress: doc.laborMarketAddress },
    { $set: doc, $setOnInsert: { reviewCount: 0 } },
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
  const metadata = submissionMetaDataSchema.parse(form); // Prune extra fields from form
  const cid = await uploadJsonToIpfs(user, metadata, metadata.title);
  // parse for type safety
  const contractData = SubmissionContractSchema.parse({
    laborMarketAddress: laborMarketAddress,
    serviceRequestId: serviceRequestId,
    uri: cid,
  });
  return contractData;
};
