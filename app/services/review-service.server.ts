import { ScalableLikertEnforcement } from "labor-markets-abi";
import type { TracerEvent } from "pinekit/types";
import { ScalableLikertEnforcement__factory } from "~/contracts";
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
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of reviews that match a given ReviewSearch.
 * @param {FilterParams} params - The search parameters.
 * @returns {number} - The number of reviews that match the search.
 */
export const countReviews = async (params: FilterParams) => {
  return mongo.reviews.countDocuments(searchParams(params));
};

type FilterParams = Pick<ReviewSearch, "laborMarketAddress" | "serviceRequestId" | "submissionId" | "score">;
/**
 * Convenience function to share the search parameters between search and count.
 * @param {FilterParams} params - The search parameters.
 * @returns criteria to find review in MongoDb
 */
const searchParams = (params: FilterParams): Parameters<typeof mongo.reviews.find>[0] => {
  return {
    ...(params.laborMarketAddress ? { laborMarketAddress: params.laborMarketAddress } : {}),
    ...(params.serviceRequestId ? { serviceRequestId: params.serviceRequestId } : {}),
    ...(params.submissionId ? { submissionId: params.submissionId } : {}),
    ...(params.score ? { score: { $in: params.score } } : {}),
  };
};

/**
 * Finds a user's review on a submission if it exists
 * @param {String} id - The ID of the submission.
 * @param {String} userAddress - The address of the user
 * @returns - the users submission or null if not found.
 */
export const findUserReview = async (submissionId: string, laborMarketAddress: `0x${string}`, userAddress: string) => {
  return mongo.reviews.findOne({
    laborMarketAddress,
    submissionId,
    reviewer: userAddress,
  });
};

/**
 * Finds a review by its ID.
 * @param {String} id - The ID of the review.
 * @returns - The Submission or null if not found.
 */
export const findReview = async (id: string, laborMarketAddress: `0x${string}`) => {
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
  // hardocoding to ScalableLikertEnforcement for now (like it is in the labor market creation hook)
  const enforceContract = ScalableLikertEnforcement__factory.connect(ScalableLikertEnforcement.address, nodeProvider);
  const submissionToScore = await enforceContract.submissionToScore(event.contract.address, submissionId, {
    blockTag: event.block.number,
  });

  const doc: Omit<ReviewDoc, "createdAtBlockTimestamp"> = {
    laborMarketAddress: event.contract.address as `0x${string}`,
    serviceRequestId: requestId,
    submissionId: submissionId,
    score: reviewScore,
    reviewer: reviewer,
    indexedAt: new Date(),
  };

  await mongo.submissions.updateOne(
    { laborMarketAddress: doc.laborMarketAddress, id: doc.submissionId },
    {
      $set: {
        score: {
          reviewCount: submissionToScore.reviewCount.toNumber(),
          reviewSum: submissionToScore.reviewSum.toNumber(),
          avg: submissionToScore.avg.toNumber(),
          qualified: submissionToScore.qualified,
        },
      },
    }
  );

  return mongo.reviews.updateOne(
    { laborMarketAddress: doc.laborMarketAddress, submissionId: doc.submissionId, reviewer: doc.reviewer },
    { $set: doc, $setOnInsert: { createdAtBlockTimestamp: new Date(event.block.timestamp) } },
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
