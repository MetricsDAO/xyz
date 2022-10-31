import type { PrismaClient } from "@prisma/client";
import { fakeBrainstormMarketplaces } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private prisma: PrismaClient) {}

  brainstormMarketplaces(opts: { page: number; sortBy?: string; search?: string }) {
    const pageSize = 10;
    const totalPages = 5;
    const data = fakeBrainstormMarketplaces(pageSize * totalPages);
    const { page, sortBy, search } = opts;
    let filteredAndSortedData = [...data];
    if (sortBy) {
      if (sortBy === "project") {
        filteredAndSortedData = filteredAndSortedData.sort((a, b) => {
          if (a.project < b.project) return -1;
          if (a.project > b.project) return 1;
          return 0;
        });
      }
    }
    if (search) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => m.title.includes(search));
    }
    const pageData = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
    return {
      pageNumber: opts.page,
      totalPages: Math.floor(filteredAndSortedData.length / pageSize),
      data: pageData,
    };
  }
}
