import type { GetLoadContextFunction } from "@remix-run/express";
import MarketplaceService from "./services/marketplace-service.server";
import { prisma } from "./services/prisma.server";

export const getLoadContext: GetLoadContextFunction = (req, res) => {
  return { prisma: prisma, marketplaces: new MarketplaceService(prisma) };
};
