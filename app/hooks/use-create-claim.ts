import { useQuery } from "@tanstack/react-query";

export function useClaimer() {
  return useQuery(["claimer"], async () => {
    return {};
  });
}
