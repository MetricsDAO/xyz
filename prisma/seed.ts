import { upsertLaborMarket } from "~/services/labor-market.server";
import { fakeLaborMarket, fakeReview, fakeServiceRequest, fakeSubmission } from "~/utils/fakes";
import { prisma } from "~/services/prisma.server";
import { faker } from "@faker-js/faker";
import { upsertServiceRequest } from "~/services/challenges-service.server";
import { upsertSubmission } from "~/services/submissions.server";
import type { LaborMarket, ServiceRequest, Submission } from "@prisma/client";
import { upsertReview } from "~/services/review-service.server";

async function main() {
  await prisma.project.createMany({
    data: [
      { slug: "solana", name: "Solana" },
      { slug: "metricsdao", name: "MetricsDAO" },
      { slug: "avalanche", name: "Avalanche" },
      { slug: "polygon", name: "Polygon" },
      { slug: "arbitrum", name: "Arbitrum" },
      { slug: "axelar", name: "Axelar" },
      { slug: "near", name: "Near" },
      { slug: "flow", name: "Flow" },
      { slug: "ethereum", name: "Ethereum" },
    ],
    skipDuplicates: true,
  });

  await prisma.network.createMany({
    data: [{ name: "Ethereum" }, { name: "Solana" }],
    skipDuplicates: true,
  });

  await prisma.token.createMany({
    data: [
      {
        name: "USD Coin",
        networkName: "Ethereum",
        symbol: "USDC",
      },
      {
        name: "Ethereum",
        networkName: "Ethereum",
        symbol: "ETH",
      },
      {
        name: "Solana",
        networkName: "Solana",
        symbol: "SOL",
      },
    ],
  });

  await seedLaborMarkets();
  await seedServiceRequests(await prisma.laborMarket.findMany());
  await seedSubmissions(await prisma.serviceRequest.findMany());
  await seedReviews(await prisma.submission.findMany());
}

async function seedLaborMarkets() {
  const projectIds = (await prisma.project.findMany()).map((p) => p.id);
  const tokenSymbols = (await prisma.token.findMany()).map((t) => t.symbol);
  // create 100 fake labor markets in prisma
  for (let i = 0; i < 15; i++) {
    await upsertLaborMarket(
      fakeLaborMarket({
        projectIds: faker.helpers.arrayElements(faker.helpers.arrayElements(projectIds, 2)), // pick between 1-2 random projects
        tokenSymbols: faker.helpers.arrayElements(tokenSymbols), // pick a subset of random tokens
      })
    );
  }
}

// create 10 fake service requests/challenges for each labor market in Prisma
async function seedServiceRequests(laborMarkets: LaborMarket[]) {
  for (const laborMarket of laborMarkets) {
    await upsertServiceRequest(fakeServiceRequest({}, laborMarket.address as string));
  }
}

async function seedSubmissions(allChallenges: ServiceRequest[]) {
  for (const challenge of allChallenges) {
    // create 3 fake submissions for each challenge in Prisma
    for (let i = 0; i < 3; i++) {
      const submission = fakeSubmission({}, challenge.laborMarketAddress, challenge.internalId);
      await upsertSubmission(submission);
    }
  }
}

async function seedReviews(allSubmissions: Submission[]) {
  for (const submission of allSubmissions) {
    // create 3 fake reviews for each submission in Prisma
    for (let i = 0; i < 3; i++) {
      await upsertReview(
        fakeReview({}, submission.serviceRequestId, submission.laborMarketAddress, submission.internalId)
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
