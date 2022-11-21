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
