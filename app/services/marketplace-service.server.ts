import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { fakeBrainstormMarketplaces } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private dataFunctionArgs: DataFunctionArgs) {}

  brainstormMarketplaces() {
    const url = new URL(this.dataFunctionArgs.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const sortBy = url.searchParams.get("sortBy");
    const search = url.searchParams.get("search");
    const filter = url.searchParams.get("filter");
    const rewardToken = url.searchParams.get("rewardToken");
    const chainProject = url.searchParams.get("chainProject");
    const pageSize = 10;
    const totalPages = 5;
    const data = fakeBrainstormMarketplaces(pageSize * totalPages);

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
    if (rewardToken) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => m.rewardTokens.some((t) => rewardToken.includes(t)));
    }
    if (chainProject) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => chainProject.includes(m.project));
    }
    const pageData = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
    return {
      pageNumber: page,
      totalResults: filteredAndSortedData.length,
      totalPages: Math.floor(filteredAndSortedData.length / pageSize),
      data: pageData,
    };
  }
}
