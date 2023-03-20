import { useTypedRouteLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import type { loader as rootLoader } from "~/root";

export function useProjects() {
  const data = useTypedRouteLoaderData<typeof rootLoader>("root");
  invariant(data, "No data found for root route");
  return data.projects;
}

export function useTokens() {
  const data = useTypedRouteLoaderData<typeof rootLoader>("root");
  invariant(data, "No data found for root route");
  return data.tokens;
}
