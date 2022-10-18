import { useMutation } from "@tanstack/react-query";
import type { Topic } from "~/domain";

export function useCreateTopic() {
  return useMutation(async (topic: Topic) => {
    return {} as Topic;
  });
}
