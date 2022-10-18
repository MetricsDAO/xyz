import { useQuery } from "@tanstack/react-query";
import type { Topic } from "~/domain";

const mockTopic: Topic = {
  id: "",
  title: "",
  description: "",
  payCurve: "",
  startsAt: undefined,
  endsAt: undefined,
  status: "pending",
  programId: "",
  sponsor: "",
};

export function topicKey(id: string) {
  return ["topic", id];
}

export function useTopic(id: string) {
  return useQuery<Topic>(topicKey(id), async () => {
    return mockTopic;
  });
}
