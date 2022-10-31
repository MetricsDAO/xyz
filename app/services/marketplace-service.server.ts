import type { PrismaClient } from "@prisma/client";
import { fakeBrainstormMarketplaces } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private prisma: PrismaClient) {}

  brainstormMarketplaces(opts: {
    page: number;
    sortBy?: string;
    search?: string;
    project?: string;
    token?: string;
    filter?: string;
  }) {
    const pageSize = 10;
    const totalPages = 5;
    const data = fakeBrainstormMarketplaces(pageSize * totalPages);
    const { page, sortBy, search, token, project, filter } = opts;
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
    if (filter) {
      //Needs badges
    }
    if (token) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => m.rewardTokens.some((t) => token.includes(t)));
    }
    if (project) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => project.includes(m.project));
    }
    const pageData = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
    return {
      pageNumber: opts.page,
      totalPages: Math.floor(filteredAndSortedData.length / pageSize),
      data: pageData,
    };
  }
}
