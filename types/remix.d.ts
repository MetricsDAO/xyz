import type { PrismaClient } from "@prisma/client";
import type MarketplaceService from "~/services/marketplace-service.server";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    prisma: PrismaClient;
    marketplaces: MarketplaceService;
  }
}
