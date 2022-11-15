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
    include: { serviceRequest: true, Reviews: true },
  });
};

/**
 * Creates or updates a new submission. This is only really used by the indexer.
 * @param {Submission} submission - The submission to create.
 */
export const upsertSubmission = async (submission: Submission) => {
  const { id, ...data } = submission;
  const newSubmission = await prisma.submission.upsert({
    where: { id },
    update: data,
    create: {
      id,
      ...data,
    },
  });
  return newSubmission;
};
