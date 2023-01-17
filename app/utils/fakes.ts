import { faker } from "@faker-js/faker";
import type { Review } from "@prisma/client";
import type { ServiceRequest, ServiceRequestIndexer } from "~/domain";
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
    title: `Labor Market - ${faker.random.words(3)}`,
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

export const fakeServiceRequest = (data: Partial<ServiceRequest>): ServiceRequestIndexer => {
  return {
    id: faker.datatype.uuid(),
    contractId: faker.datatype.uuid(),
    title: `Service Request - ${faker.random.words(3)}`,
    description: faker.random.words(10),
    laborMarketAddress: faker.finance.ethereumAddress(),
    pTokenAddress: faker.finance.ethereumAddress(),
    pTokenId: faker.datatype.number(),
    pTokenQuantity: faker.datatype.number(),
    signalExpiration: faker.date.future(),
    submissionExpiration: faker.date.future(),
    enforcementExpiration: faker.date.future(),
    uri: faker.internet.url(),
    createdAt: faker.date.past(),
    ...data,
  };
};

export const fakeSubmission = (data: Partial<SubmissionIndexer>): SubmissionIndexer => {
  return {
    id: faker.datatype.uuid(),
    contractId: faker.datatype.uuid(),
    serviceRequestId: faker.datatype.uuid(),
    title: `Submission - ${faker.random.words(3)}`,
    description: faker.random.words(10),
    creatorId: faker.datatype.uuid(),
    laborMarketAddress: faker.finance.ethereumAddress(),
    score: 10,
    ...data,
  };
};

export const fakeReview = (data: Partial<Review>): Review => {
  return {
    id: faker.datatype.uuid(),
    contractId: faker.datatype.uuid(),
    serviceRequestId: faker.datatype.uuid(),
    laborMarketAddress: faker.finance.ethereumAddress(),
    comment: faker.random.words(3),
    score: 10,
    createdAt: faker.date.past(),
    creatorId: faker.datatype.uuid(),
    submissionId: faker.datatype.uuid(),
    ...data,
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
