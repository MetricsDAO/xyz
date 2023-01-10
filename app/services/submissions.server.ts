import type { Submission } from "@prisma/client";
import type { ServiceRequest } from "~/domain";
import type { SubmissionContract, SubmissionForm, SubmissionSearch } from "~/domain/submission";
import { SubmissionContractSchema } from "~/domain/submission";
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
    include: { serviceRequest: true, reviews: true },
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

/**
 * Prepare a new Submission for writing to chain
 * @param {string} laborMarketAddress - The labor market address the submission belongs to
 * @param {ServiceRequest} form - the service request the submission is being submitted for
 * @returns {SubmissionContract} - The prepared submission
 */
export const prepareSubmission = (
  serviceRequest: Pick<ServiceRequest, "laborMarketAddress">,
  form: SubmissionForm
): SubmissionContract => {
  // TODO: upload data to ipfs

  // parse for type safety
  const contractData = SubmissionContractSchema.parse({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    serviceRequestId: 1, // TODO should come from db
    uri: "ipfs-uri",
  });
  return contractData;
};
