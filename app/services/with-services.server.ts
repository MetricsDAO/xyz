import type { DataFunctionArgs } from "@remix-run/server-runtime";
import MarketplaceService from "./marketplace-service.server";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.server";

type Services = {
  marketplace: MarketplaceService;
  prisma: PrismaClient;
};

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const marketplace = new MarketplaceService(prisma);
  return fn({
    prisma,
    marketplace,
  });
}

export { withServices };
