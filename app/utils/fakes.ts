import { faker } from "@faker-js/faker";
import type { Marketplace, ChallengeWithMarketplace } from "~/domain";

// This module export utlity functions to generate fake data for testing and development
// Uses domain types from ~/domain.

export function fakeMarketplace(): Marketplace {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    type: "brainstorm",
    startsAt: faker.date.future(),
    endsAt: faker.date.future(),
    rewardCurve: 1,
    rewardTokens: [],
    rewardPool: faker.datatype.number(),
    authorRepMin: faker.datatype.number(),
    privacy: "public",
    creator: faker.finance.ethereumAddress(),
    reviewPriorityFactor: "cheap",
    reviewerRepMax: faker.datatype.number(),
    reviewerRepMin: faker.datatype.number(),
    reviewMethod: "likert",
    authorRepMax: faker.datatype.number(),
    project: faker.helpers.arrayElement(["Solana", "Ethereum"]),
    challengeCount: faker.datatype.number(),
    entryCost: faker.datatype.number(),
    reviewDeadline: faker.date.future(),
  };
}

export function fakeChallenge(): ChallengeWithMarketplace {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(6),
    description: faker.lorem.paragraph(),
    sponsor: faker.lorem.word() + ".eth",
    status: "pending",
    payCurve: "flat",
    programId: faker.datatype.uuid(),
    marketplace: fakeMarketplace(),
  };
}

export const fakeBrainstormMarketplaces = (count: number) => {
  // deterministic results
  faker.seed(1337);
  return Array.from({ length: count }).map(fakeMarketplace);
};

export const fakeChallenges = (count: number) => {
  // deterministic results
  faker.seed(20);
  return Array.from({ length: count }).map(fakeChallenge);
};
