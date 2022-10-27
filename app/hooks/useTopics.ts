import { useQuery } from "@tanstack/react-query";
import type { TopicWithProgram } from "~/domain";
import { fakeTopic } from "~/utils/fakes";

type Params = {};

export function useTopics(params: Params) {
  return useQuery(["topics", { params }], async () => {
    return TOPICS;
  });
}

const TOPICS: TopicWithProgram[] = Array.from({ length: 10 }).map(fakeTopic);
