import type { User } from "@prisma/client";
import type { TracerEvent } from "pinekit/types";
import { LaborMarket__factory } from "~/contracts";
import type { ReviewContract, ReviewDoc, ReviewSearch } from "~/domain/review";
import { ReviewSchema } from "~/domain/review";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";

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
export const findReview = async (id: string, laborMarketAddress: string) => {
  return mongo.reviews.findOne({ valid: true, laborMarketAddress, id });
};

/**
 * Counts the number of reviews on a particular submission.
 * @param {submissionId} params - The submission to count reviews for.
 * @returns {number} - The number of reviews that match the search.
 */
export const countReviewsOnSubmission = async (submissionId: string) => {
  return mongo.reviews.countDocuments({ submissionId, valid: true });
};

/**
 * Create a new ReviewDoc from a TracerEvent.
 */
export const indexReview = async (event: TracerEvent) => {
  const contract = LaborMarket__factory.connect(event.contract.address, nodeProvider);
  const { submissionId, score, requestId } = ReviewSchema.parse(event.decoded.inputs);
  const review = await contract.review(submissionId, score, requestId);

  const doc: Omit<ReviewDoc, "reviewCount"> = {
    id: submissionId,
    laborMarketAddress: event.contract.address,
    submissionId: submissionId,
    score: score,
    indexedAt: new Date(),
  };

  await mongo.serviceRequests.updateOne(
    { id: doc.submissionId },
    {
      $inc: {
        reviewCount: 1,
      },
    }
  );

  return mongo.reviews.updateOne({ id: doc.id, laborMarketAddress: doc.laborMarketAddress }, { upsert: true });
};

// /**
//  * Prepare a new Submission for writing to chain
//  * @param {string} laborMarketAddress - The labor market address the submission belongs to
//  * @param {string} serviceRequestId - The service request the submission belongs to
//  * @param {SubmissionForm} form - the service request the submission is being submitted for
//  * @returns {SubmissionContract} - The prepared submission
//  */
// export const prepareReview = async (
//   user: User,
//   laborMarketAddress: string,
//   submissionId: string,
//   score: number
// ): Promise<ReviewContract> => {
//   const contractData = ReviewSchema.parse({
//     laborMarketAddress: laborMarketAddress,
//     submissionId: submissionId,
//     score: score,
//   });
//   return contractData;
// };
