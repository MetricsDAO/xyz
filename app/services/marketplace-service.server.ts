import type { PrismaClient } from "@prisma/client";
import { fakeBrainstormMarketplacePages } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private prisma: PrismaClient) {}

  brainstormMarketplaces({ page }: { page: number }) {
    const { data, totalPages } = fakeBrainstormMarketplacePages(page - 1);
    return {
      pageNumber: page,
      totalPages,
      data: data[page - 1],
    };
  }
}
