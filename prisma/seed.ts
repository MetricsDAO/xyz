import { upsertLaborMarket } from "~/services/labor-market.server";
import { fakeLaborMarket, fakeReview, fakeServiceRequest, fakeSubmission } from "~/utils/fakes";
import { prisma } from "~/services/prisma.server";
import { faker } from "@faker-js/faker";
import { upsertServiceRequest } from "~/services/challenges-service.server";
import { upsertSubmission } from "~/services/submissions.server";
import type { LaborMarket, PayableBlockchain, ServiceRequest, Submission, Token } from "@prisma/client";
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
  });

  await prisma.payableBlockchain.createMany({
    data: [
      { id: "1", tokenSymbol: "ETH", name: "Ethereum" },
      { id: "2", tokenSymbol: "SOL", name: "Solana" },
      { id: "3", tokenSymbol: "USDC", name: "USD Coin" },
      { id: "4", tokenSymbol: "MATIC", name: "Polygon" },
      { id: "5", tokenSymbol: "AXL", name: "Axelar" },
      { id: "6", tokenSymbol: "NEAR", name: "Near" },
      { id: "7", tokenSymbol: "FLOW", name: "Flow" },
      { id: "8", tokenSymbol: "AVAX", name: "Avalanche" },
    ],
  });

  async function seedTokens(payableBlockchain: PayableBlockchain[]) {
    for (const blockchain of payableBlockchain) {
      await prisma.token.create({
        data: {
          symbol: blockchain.tokenSymbol,
          name: blockchain.name,
          payableBlockchainId: blockchain.id,
        },
      });
    }
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
        await upsertSubmission(fakeSubmission({}, challenge.id));
      }
    }
  }

  async function seedReviews(allSubmissions: Submission[]) {
    for (const submission of allSubmissions) {
      // create 3 fake reviews for each submission in Prisma
      for (let i = 0; i < 3; i++) {
        await upsertReview(fakeReview({}, submission.id));
      }
    }
  }

  await seedTokens(await prisma.payableBlockchain.findMany());
  await seedLaborMarkets();
  await seedServiceRequests(await prisma.laborMarket.findMany());
  await seedSubmissions(await prisma.serviceRequest.findMany());
  await seedReviews(await prisma.submission.findMany());
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
