import { faker } from "@faker-js/faker";
import type { ServiceRequest, ServiceRequestContract } from "~/domain";
import type { LaborMarket } from "~/domain";
import type { SubmissionIndexer } from "~/domain/submission/schemas";

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
    submitRepMin: faker.datatype.number(),
    submitRepMax: faker.datatype.number(),
    launch: {
      access: "delegates",
      badgerAddress: faker.finance.ethereumAddress() as `0x${string}`,
      badgerTokenId: faker.datatype.string(),
    },
    sponsorAddress: faker.finance.ethereumAddress() as `0x${string}`,
    reviewBadgerAddress: faker.finance.ethereumAddress() as `0x${string}`,
    reviewBadgerTokenId: faker.datatype.string(),
    projectSlugs: ["ethereum", "polygon"],
    ...data,
  };
};

export const fakeServiceRequest = (data: Partial<ServiceRequest>): ServiceRequestContract => {
  const signal = faker.date.soon(7);
  const submission = faker.date.soon(7, signal);
  const enforcement = faker.date.soon(7, submission);

  return {
    id: faker.datatype.uuid(),
    title: `Service Request - ${faker.random.words(3)}`,
    description: faker.random.words(10),
    laborMarketAddress: faker.finance.ethereumAddress() as `0x${string}`,
    pTokenAddress: faker.finance.ethereumAddress() as `0x${string}`,
    pTokenQuantity: faker.datatype.string(),
    signalExpiration: signal,
    submissionExpiration: submission,
    enforcementExpiration: enforcement,
    uri: faker.internet.url(),
    createdAt: faker.date.past(),
    ...data,
  };
};

export const fakeSubmission = (data: Partial<SubmissionIndexer>): SubmissionIndexer => {
  return {
    id: faker.datatype.uuid(),
    contractId: faker.datatype.number().toString(),
    serviceRequestId: faker.datatype.uuid(),
    title: `Submission - ${faker.random.words(3)}`,
    description: faker.random.words(10),
    creatorId: faker.datatype.uuid(),
    laborMarketAddress: faker.finance.ethereumAddress() as `0x${string}`,
    score: 10,
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
