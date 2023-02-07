import type { Review, User } from "@prisma/client";
import { TracerEvent } from "pinekit/types";
import type { ReviewSearch } from "~/domain/review";
import { mongo } from "./mongo.server";
import { prisma } from "./prisma.server";

/**
 * Returns an array of ReviewDoc for a given Submission.
 */
export const searchReviews = async (params: ReviewSearch) => {
  return mongo.reviews
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of reviews that match a given ReviewSearch.
 * @param {ReviewSearch} params - The search parameters.
 * @returns {number} - The number of reviews that match the search.
 */
export const countReviews = async (params: ReviewSearch) => {
  return mongo.reviews.countDocuments(searchParams(params));
};

/**
 * Convenience function to share the search parameters between search and count.
 * @param {ReviewSearch} params - The search parameters.
 * @returns criteria to find review in MongoDb
 */
const searchParams = (params: ReviewSearch): Parameters<typeof mongo.reviews.find>[0] => {
  return {
    valid: true,
    ...(params.submissionId ? { submissionId: params.submissionId } : {}),
  };
};

/**
 * Finds a review by its ID.
 * @param {String} id - The ID of the review.
 * @returns - The Submission or null if not found.
 */
export const findSubmission = async (id: string, laborMarketAddress: string) => {
  return mongo.reviews.findOne({ valid: true, laborMarketAddress, id });
};

/**
 * Counts the number of Submissions on a particular service request.
 * @param {SubmissionSearch} params - The search parameters.
 * @returns {number} - The number of submissions that match the search.
 */
export const countSubmissionsOnServiceRequest = async (serviceRequestId: string) => {
  return mongo.submissions.countDocuments({ serviceRequestId, valid: true });
};

// /**
//  * Create a new SubmissionDoc from a TracerEvent.
//  */
// export const indexSubmission = async (event: TracerEvent) => {
//   const contract = LaborMarket__factory.connect(event.contract.address, nodeProvider);
//   const { submissionId, requestId } = SubmissionEventSchema.parse(event.decoded.inputs);
//   const submission = await contract.serviceSubmissions(submissionId, { blockTag: event.block.number });
//   const appData = await fetchIpfsJson(submission.uri)
//     .then(SubmissionFormSchema.parse)
//     .catch(() => null);

//   const isValid = appData !== null;
//   // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
//   const doc: Omit<SubmissionDoc, "reviewCount"> = {
//     id: submissionId,
//     laborMarketAddress: event.contract.address,
//     serviceRequestId: requestId,
//     valid: isValid,
//     reviewed: submission.reviewed,
//     submissionUrl: appData?.submissionUrl ? appData.submissionUrl : null,
//     indexedAt: new Date(),
//     configuration: {
//       serviceProvider: submission.serviceProvider,
//       uri: submission.uri,
//     },
//     appData,
//   };

//   if (isValid) {
//     await mongo.serviceRequests.updateOne(
//       { id: doc.serviceRequestId },
//       {
//         $inc: {
//           submissionCount: 1,
//         },
//       }
//     );
//   }

//   return mongo.submissions.updateOne(
//     { id: doc.id, laborMarketAddress: doc.laborMarketAddress },
//     { $set: doc, $setOnInsert: { reviewCount: 0 } },
//     { upsert: true }
//   );
// };
// /**
//  * Prepare a new Submission for writing to chain
//  * @param {string} laborMarketAddress - The labor market address the submission belongs to
//  * @param {string} serviceRequestId - The service request the submission belongs to
//  * @param {SubmissionForm} form - the service request the submission is being submitted for
//  * @returns {SubmissionContract} - The prepared submission
//  */
// export const prepareSubmission = async (
//   user: User,
//   laborMarketAddress: string,
//   serviceRequestId: string,
//   form: SubmissionForm
// ): Promise<SubmissionContract> => {
//   const metadata = SubmissionFormSchema.parse(form); // Prune extra fields from form
//   const cid = await uploadJsonToIpfs(user, metadata, metadata.title);
//   // parse for type safety
//   const contractData = SubmissionContractSchema.parse({
//     laborMarketAddress: laborMarketAddress,
//     serviceRequestId: serviceRequestId,
//     uri: cid,
//   });
//   return contractData;
//};
