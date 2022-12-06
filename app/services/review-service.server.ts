import type { Review } from "@prisma/client";
import { prisma } from "./prisma.server";

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


/**
 * Counts the number of Reviews that match the given Submissions.
 * @param {string[]} submissionIds - The submisions to search.
 * @returns {number} - The number of reviews in the given submissions.
 */
export const countReviews = async (submissionIds: string[]) => {
  return prisma.review.count({
    where: {
      submissionId: {
        in: submissionIds,
      },
    },
  });
};
