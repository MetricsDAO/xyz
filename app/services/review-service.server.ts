import type { TracerEvent } from "pinekit/types";
import type { ReviewContract, ReviewDoc, ReviewForm, ReviewSearch } from "~/domain/review";
import { ReviewEventSchema, ReviewSchema } from "~/domain/review";
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
    ...(params.laborMarketAddress ? { laborMarketAddress: params.laborMarketAddress } : {}),
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
  const { submissionId, reviewer, reviewScore, requestId } = ReviewEventSchema.parse(event.decoded.inputs);

  const blockTimestamp = (await nodeProvider.getBlock(event.block.number)).timestamp;

  const doc: Omit<ReviewDoc, "reviewCount"> = {
    laborMarketAddress: event.contract.address,
    serviceRequestId: requestId,
    submissionId: submissionId,
    score: reviewScore,
    reviewer: reviewer,
    blockTimestamp: new Date(blockTimestamp * 1000),
    indexedAt: new Date(),
  };

  await mongo.submissions.updateOne(
    { laborMarketAddress: doc.laborMarketAddress, id: doc.submissionId },
    {
      $inc: {
        reviewCount: 1,
      },
    }
  );

  return mongo.reviews.updateOne(
    { laborMarketAddress: doc.laborMarketAddress, submissionId: doc.submissionId },
    { $set: doc },
    { upsert: true }
  );
};

/**
 * Prepare a new Submission for writing to chain
 * @param {string} laborMarketAddress - The labor market address the submission belongs to
 * @param {string} serviceRequestId - The service request the submission belongs to
 * @param {SubmissionForm} form - the service request the submission is being submitted for
 * @returns {ReviewContract} - The prepared submission
 */
export const prepareReview = async (
  laborMarketAddress: string,
  submissionId: string,
  requestId: string,
  form: ReviewForm
): Promise<ReviewContract> => {
  const contractData = ReviewSchema.parse({
    laborMarketAddress: laborMarketAddress,
    requestId: requestId,
    submissionId: submissionId,
    score: form.score,
  });
  return contractData;
};
