import type { Submission } from "@prisma/client";
import { prisma } from "./prisma.server";

/**
 * Finds a submission by its id.
 * @param {string} submissionId - The ID of the submission to find.
 * @returns {Promise<Submission | null>} - The submission or null if not found.
 */
export const findSubmission = async (submissionId: string) => {
  return prisma.submission.findFirst({
    where: { id: submissionId },
    include: { serviceRequest: true },
  });
};

/**
 * Creates or updates a new LaborMarket. This is only really used by the indexer.
 * @param {ServiceRequest} challenge - The labor market to create.
 */
export const upsertSubmission = async (submission: Submission) => {
  const { id, serviceRequestId } = submission;
  const newSubmission = await prisma.submission.create({
    data: { id, serviceRequestId },
  });
  return newSubmission;
};
