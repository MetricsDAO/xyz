import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { fakeBrainstormMarketplaces } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private dataFunctionArgs: DataFunctionArgs) {}

  brainstormMarketplaces() {
    const url = new URL(this.dataFunctionArgs.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const sortBy = url.searchParams.get("sortBy");
    const search = url.searchParams.get("search");
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
    const pageData = filteredAndSortedData.slice((page - 1) * pageSize, page * pageSize);
    return {
      pageNumber: page,
      totalPages: Math.floor(filteredAndSortedData.length / pageSize),
      data: pageData,
    };
  }
}
