import type { Review } from "@prisma/client";
import type { ReviewSearch } from "~/domain/review";
import { prisma } from "./prisma.server";

/**
 * Returns an array of Reviews for a given ReviewSearch.
 * @param {ReviewSearch} params - The search parameters.
 */
export const searchReviews = async (params: ReviewSearch) => {
  return prisma.review.findMany({
    where: {
      scoreStatus: {
        in: params.score,
      },
      submissionId: params.submissionId,
    },
    orderBy: {
      [params.sortBy]: params.order,
    },
    take: params.first,
    skip: params.first * (params.page - 1),
  });
};

/**
 * Creates or updates a new review. This is only really used by the indexer.
 * @param {Review} review - The review to create.
 */
export const upsertReview = async (review: Review) => {
  const { id, ...data } = review;
  const newReview = await prisma.review.upsert({
    where: { id },
    update: data,
    create: {
      id,
      ...data,
    },
  });
  return newReview;
};
