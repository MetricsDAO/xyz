import { useQuery } from "@tanstack/react-query";
import type { Challenge } from "~/domain";

const mockChallenge: Challenge = {
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

export function challengeKey(id: string) {
  return ["topic", id];
}

export function useChallenge(id: string) {
  return useQuery<Challenge>(challengeKey(id), async () => {
    return mockChallenge;
  });
}
