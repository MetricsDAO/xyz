import type { DataFunctionArgs } from "@remix-run/server-runtime";
import MarketplaceService from "./marketplace-service.server";

type Services = {
  marketplace: MarketplaceService;
};

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const marketplace = new MarketplaceService(data);
  return fn({
    marketplace,
  });
}

export { withServices };
