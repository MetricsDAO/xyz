import { useMutation } from "@tanstack/react-query";
import type { Program } from "~/domain";

export function useCreateCollection() {
  return useMutation((collection: Program) => {});
}
