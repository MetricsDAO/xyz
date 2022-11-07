import { useQuery } from "@tanstack/react-query";
import type { ChallengeWithMarketplace } from "~/domain";
import { fakeChallenge } from "~/utils/fakes";

type Params = {};

export function useChallenges(params: Params) {
  return useQuery(["challenges", { params }], async () => {
    return CHALLENGES;
  });
}

const CHALLENGES: ChallengeWithMarketplace[] = Array.from({ length: 10 }).map(fakeChallenge);
