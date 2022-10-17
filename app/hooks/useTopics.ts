import { useQuery } from "@tanstack/react-query";
import type { Program, TopicWithProgram } from "~/domain";
import { faker } from "@faker-js/faker";

type Params = {};

export function useTopics(params: Params) {
  return useQuery(["topics", { params }], async () => {
    return TOPICS;
  });
}

const TOPICS: TopicWithProgram[] = Array.from({ length: 10 }).map(createRandomTopic);

function createRandomTopic(): TopicWithProgram {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(6),
    description: faker.lorem.paragraph(),
    sponsor: faker.lorem.word() + ".eth",
    status: "pending",
    payCurve: "flat",
    programId: faker.datatype.uuid(),
    program: createRandomProgram(),
  };
}

function createRandomProgram(): Program {
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
    creator: faker.datatype.uuid(),
    reviewPriorityFactor: "cheap",
    reviewerRepMax: faker.datatype.number(),
    reviewerRepMin: faker.datatype.number(),
    reviewMethod: "likert",
    authorRepMax: faker.datatype.number(),
  };
}
