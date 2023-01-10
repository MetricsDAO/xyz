import { faker } from "@faker-js/faker";
import type { Review, Submission } from "@prisma/client";
import type { ServiceRequest, ServiceRequestContract } from "~/domain";
import type { LaborMarket } from "~/domain";
import type { SubmissionIndexer } from "~/domain/submission";

// This module export utlity functions to generate fake data for testing and development
// Uses domain types from ~/domain.

/**
 * Creates a fake LaborMarket. Development use only.
 * @returns {LaborMarketNew} laborMarket - The labor market to create.
 */
export const fakeLaborMarket = (data: Partial<LaborMarket>): LaborMarket => {
  return {
    address: faker.finance.ethereumAddress(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    type: faker.helpers.arrayElement(["brainstorm", "analyze"]) as "brainstorm" | "analyze",
    rewardCurveAddress: faker.finance.ethereumAddress(),
    submitRepMin: faker.datatype.number(),
    submitRepMax: faker.datatype.number(),
    launch: {
      access: "delegates",
      badgerAddress: faker.finance.ethereumAddress(),
      badgerTokenId: faker.datatype.string(),
    },
    sponsorAddress: faker.finance.ethereumAddress(),
    reviewBadgerAddress: faker.finance.ethereumAddress(),
    reviewBadgerTokenId: faker.datatype.string(),
    tokenSymbols: [],
    projectIds: [],
    ...data,
  };
};

export const fakeServiceRequest = (
  data: Partial<ServiceRequest>,
  laborMarketAddress: string
): ServiceRequestContract => {
  return {
    id: faker.datatype.string(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    laborMarketAddress: laborMarketAddress,
    pTokenAddress: faker.finance.ethereumAddress(),
    pTokenId: faker.datatype.number(),
    pTokenQuantity: "0.0001",
    signalExpiration: faker.date.future(),
    submissionExpiration: faker.date.future(),
    enforcementExpiration: faker.date.future(),
    uri: faker.internet.url(),
  };
};

export const fakeSubmission = (
  data: Partial<SubmissionIndexer>,
  laborMarketAddress: string,
  serviceRequestId: string
): SubmissionIndexer => {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    creatorId: faker.datatype.uuid(),
    laborMarketAddress: laborMarketAddress,
    score: 10,
    serviceRequestId: serviceRequestId,
  };
};

export const fakeReview = (
  data: Partial<Review>,
  serviceRequestId: string,
  laborMarketAddress: string,
  submissionId: string
): Review => {
  return {
    id: faker.datatype.uuid(),
    serviceRequestId: serviceRequestId,
    laborMarketAddress: laborMarketAddress,
    comment: faker.random.words(3),
    score: 10,
    createdAt: faker.date.past(),
    creatorId: faker.datatype.uuid(),
    submissionId: submissionId,
  };
};

export const fakeRMetricDistributionData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      address: faker.finance.ethereumAddress(),
      balance: faker.datatype.number({ min: 0, max: 1000 }),
    });
  }
  return data;
};
