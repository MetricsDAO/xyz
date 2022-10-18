import { useQuery } from "wagmi";

export function collectionKey(id: string) {
  return ["collection", id];
}

export function useCollection(id: string) {
  return useQuery(collectionKey(id), async () => {});
}
