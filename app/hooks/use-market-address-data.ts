import { useTypedRouteLoaderData } from "remix-typedjson";
import type { loader } from "~/routes/app+/market.$address";

export function useMarketAddressData() {
  const data = useTypedRouteLoaderData<typeof loader>("routes/app+/market.$address");
  if (!data) {
    throw new Error("useMarketAddressData can only be used under /app/market/:address");
  }
  return data;
}
