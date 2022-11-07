import { useMutation } from "@tanstack/react-query";
import type { Challenge } from "~/domain";

export function useCreateChallenge() {
  return useMutation(async (challenge: Challenge) => {
    return {} as Challenge;
  });
}
