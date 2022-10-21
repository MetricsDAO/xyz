import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { fakeBrainstormMarketplacePages } from "~/utils/fakes";

export default class MarketplaceService {
  constructor(private dataFunctionArgs: DataFunctionArgs) {}

  brainstormMarketplaces() {
    const url = new URL(this.dataFunctionArgs.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const { data, totalPages } = fakeBrainstormMarketplacePages(page - 1);
    return {
      pageNumber: page,
      totalPages,
      data: data[page - 1],
    };
  }
}
