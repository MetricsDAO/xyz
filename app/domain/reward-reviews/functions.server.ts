import { searchReviews } from "../review/functions.server";
import type { ReviewSearch } from "../review/schemas";
import { synchronizeReviewRewards } from "./synchronize.server";

export const searchReviewsWithRewards = async (search: ReviewSearch) => {
  const reviews = await searchReviews(search);
  await synchronizeReviewRewards(reviews);
  const updatedReviews = await searchReviews(search);
  return updatedReviews;
};
