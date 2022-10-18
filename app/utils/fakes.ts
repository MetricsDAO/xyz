import { faker } from "@faker-js/faker";
import type { Program, TopicWithProgram } from "~/domain";

// This module export utlity functions to generate fake data for testing and development
// Uses domain types from ~/domain.

export function fakeProgram(): Program {
  return {
    id: faker.datatype.uuid(),
    title: faker.random.words(3),
    description: faker.random.words(10),
    type: "brainstorm",
    startsAt: faker.date.future(),
    endsAt: faker.date.future(),
    rewardCurve: 1,
    rewardTokens: [],
    authorRepMin: faker.datatype.number(),
    privacy: "public",
    creator: faker.finance.ethereumAddress(),
    reviewPriorityFactor: "cheap",
    reviewerRepMax: faker.datatype.number(),
    reviewerRepMin: faker.datatype.number(),
    reviewMethod: "likert",
    authorRepMax: faker.datatype.number(),
  };
}

export function fakeTopic(): TopicWithProgram {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(6),
    description: faker.lorem.paragraph(),
    sponsor: faker.lorem.word() + ".eth",
    status: "pending",
    payCurve: "flat",
    programId: faker.datatype.uuid(),
    program: fakeProgram(),
  };
}
