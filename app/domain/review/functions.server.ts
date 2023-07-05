import type { EvmAddress } from "~/domain/address";
import type { ReviewSearch, ReviewWithSubmission } from "~/domain/review/schemas";
import { mongo } from "../../services/mongo.server";

/**
 * Returns an array of ReviewDoc for a given Submission.
 */
export const searchReviews = async (params: ReviewSearch) => {
  return mongo.reviews
    .aggregate<ReviewWithSubmission>(searchReviewsPipeline(params))
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

type FilterParams = Pick<
  ReviewSearch,
  "laborMarketAddress" | "serviceRequestId" | "submissionId" | "score" | "reviewer"
>;
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
    ...(params.reviewer ? { reviewer: params.reviewer } : {}),
  };
};

const searchReviewsPipeline = (params: ReviewSearch) => {
  return [
    {
      $match: searchParams(params),
    },
    {
      $lookup: {
        from: "submissions",
        let: {
          m_addr: "$laborMarketAddress",
          sr_id: "$serviceRequestId",
          s_id: "$submissionId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$laborMarketAddress", "$$m_addr"] },
                  { $eq: ["$serviceRequestId", "$$sr_id"] },
                  { $eq: ["$id", "$$s_id"] },
                ],
              },
            },
          },
        ],
        as: "s",
      },
    },
    {
      $unwind: "$s",
    },
  ];
};

/**
 * Finds a user's review on a submission if it exists
 * @param {String} id - The ID of the submission.
 * @param {String} userAddress - The address of the user
 * @returns - the users submission or null if not found.
 */
export const findUserReview = async (
  laborMarketAddress: EvmAddress,
  serviceRequestId: string,
  submissionId: string,
  userAddress: EvmAddress
) => {
  return mongo.reviews.findOne({
    laborMarketAddress,
    serviceRequestId,
    submissionId,
    reviewer: userAddress,
  });
};
