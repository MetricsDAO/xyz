import type { SubmissionIndexer, SubmissionSearch } from "~/domain/submission";
import { prisma } from "./prisma.server";

/**
 * Returns an array of LaborMarkets for a given LaborMarketSearch.
 * @param params - The search parameters.
 */
export const searchSubmissions = async (params: SubmissionSearch) => {
  return prisma.submission.findMany({
    include: { reviews: true },
    where: {
      title: { search: params.q },
      description: { search: params.q },
      serviceRequestId: params.serviceRequestId,
      scoreStatus: {
        in: params.score,
      },
    },
    orderBy: {
      [params.sortBy]:
        "reviews" !== params.sortBy
          ? params.order
          : {
              _count: params.order,
            },
    },
    take: params.first,
    skip: params.first * (params.page - 1),
  });
};

/**
 * Finds a submission by its id.
 * @param {string} submissionId - The ID of the submission to find.
 * @returns {Promise<Submission | null>} - The submission or null if not found.
 */
export const findSubmission = async (submissionId: string) => {
  return prisma.submission.findFirst({
    where: { id: submissionId },
    include: { reviews: true },
  });
};

/**
 * Creates or updates a new submission. This is only really used by the indexer.
 * @param {Submission} submission - The submission to create.
 */
export const upsertSubmission = async (submission: SubmissionIndexer) => {
  const { serviceRequestId, laborMarketAddress, ...data } = submission;
  const newSubmission = await prisma.submission.upsert({
    where: { id_serviceRequestId_laborMarketAddress: { id: submission.id, serviceRequestId, laborMarketAddress } },
    update: data,
    create: {
      serviceRequestId,
      laborMarketAddress,
      ...data,
    },
  });
  return newSubmission;
};
