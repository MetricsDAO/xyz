import type { PrismaClient } from "@prisma/client";
import type { ChallengeSearch } from "~/domain/challenge";
import { fakeTopics } from "~/utils/fakes";

export default class ChallengeService {
  constructor(private prisma: PrismaClient) {}

  challenges({ page, sortBy, q, project, token }: ChallengeSearch) {
    const currentPage = page ?? 1;
    const pageSize = 10;
    const totalPages = 5;
    const data = fakeTopics(pageSize * totalPages);

    let filteredAndSortedData = [...data];
    if (sortBy) {
      if (sortBy === "project") {
        filteredAndSortedData = filteredAndSortedData.sort((a, b) => {
          if (a.marketplace.project < b.marketplace.project) return -1;
          if (a.marketplace.project > b.marketplace.project) return 1;
          return 0;
        });
      }
    }
    if (q) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => m.title.includes(q));
    }
    // if (filters) {
    //   //Needs badges
    // }
    if (token) {
      filteredAndSortedData = filteredAndSortedData.filter((m) =>
        m.marketplace.rewardTokens.some((t) => token.includes(t))
      );
    }
    if (project) {
      filteredAndSortedData = filteredAndSortedData.filter((m) => project.includes(m.marketplace.project));
    }
    const pageData = filteredAndSortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pagesFloor = Math.floor(filteredAndSortedData.length / pageSize);
    return {
      pageNumber: currentPage,
      totalResults: filteredAndSortedData.length,
      totalPages: pagesFloor > 0 ? pagesFloor : 1,
      data: pageData,
    };
  }
}
