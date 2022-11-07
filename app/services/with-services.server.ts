import type { DataFunctionArgs } from "@remix-run/server-runtime";
import MarketplaceService from "./marketplace-service.server";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.server";
import ChallengeService from "./challenges-service.server";

type Services = {
  marketplace: MarketplaceService;
  challenge: ChallengeService;
  prisma: PrismaClient;
};

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const marketplace = new MarketplaceService(prisma);
  const challenge = new ChallengeService(prisma);

  return fn({
    prisma,
    marketplace,
    challenge,
  });
}

export { withServices };
