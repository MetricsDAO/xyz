import { faker } from "@faker-js/faker";
import type { Review, Submission } from "@prisma/client";
import type { Challenge } from "~/domain";
import type { LaborMarket } from "~/domain";

// This module export utlity functions to generate fake data for testing and development
// Uses domain types from ~/domain.

// export function fakeMarketplace(): Marketplace {
//   return {
//     id: faker.datatype.uuid(),
//     title: faker.random.words(3),
//     description: faker.random.words(10),
//     type: "brainstorm",
//     startsAt: faker.date.future(),
//     endsAt: faker.date.future(),
//     rewardCurve: 1,
//     rewardTokens: [],
//     rewardPool: faker.datatype.number(),
//     authorRepMin: faker.datatype.number(),
//     privacy: "public",
//     creator: faker.finance.ethereumAddress(),
//     reviewPriorityFactor: "cheap",
//     reviewerRepMax: faker.datatype.number(),
//     reviewerRepMin: faker.datatype.number(),
//     reviewMethod: "likert",
//     authorRepMax: faker.datatype.number(),
//     project: faker.helpers.arrayElement(["Solana", "Ethereum"]),
//     topicCount: faker.datatype.number(),
//     entryCost: faker.datatype.number(),
//   };
// }

// export function fakeTopic(): TopicWithMarketplace {
//   return {
//     id: faker.datatype.uuid(),
//     title: faker.lorem.words(6),
//     description: faker.lorem.paragraph(),
//     sponsor: faker.lorem.word() + ".eth",
//     status: "pending",
//     payCurve: "flat",
//     programId: faker.datatype.uuid(),
//     marketplace: fakeMarketplace(),
//   };
// }

// export const fakeBrainstormMarketplaces = (count: number) => {
//   // deterministic results
//   faker.seed(1337);
//   return Array.from({ length: count }).map(fakeMarketplace);
// };

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

export const fakeServiceRequest = (data: Partial<Challenge>, laborMarketAddress: string): Challenge => {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    laborMarketAddress: laborMarketAddress,
  };
};

export const fakeSubmission = (data: Partial<Submission>, serviceRequestId: string): Submission => {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    createdAt: faker.date.past(),
    creatorId: faker.datatype.uuid(),
    scoreStatus: "Bad",
    serviceRequestId: serviceRequestId,
  };
};

export const fakeReview = (data: Partial<Review>, submissionId: string): Review => {
  return {
    id: faker.datatype.uuid(),
    comment: faker.random.words(3),
    scoreStatus: "Bad",
    createdAt: faker.date.past(),
    creatorId: faker.datatype.uuid(),
    submissionId: submissionId,
  };
};
