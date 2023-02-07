import { fakeLaborMarket, fakeReview, fakeSubmission } from "~/utils/fakes";
import { prisma } from "~/services/prisma.server";
import { faker } from "@faker-js/faker";
import type { ServiceRequest, Submission } from "@prisma/client";
import { upsertReview } from "~/services/review-service.server";

async function main() {
  await prisma.project.createMany({
    data: [
      { slug: "ethereum", name: "Ethereum" },
      { slug: "polygon", name: "Polygon" },
      { slug: "optimism", name: "Optimism" },
      { slug: "arbitrum", name: "Arbitrum" },
      { slug: "terra", name: "Terra" },
      { slug: "cosmos", name: "Cosmos" },
      { slug: "axelar", name: "Axelar" },
      { slug: "osmosis", name: "Osmosis" },
      { slug: "flow", name: "Flow" },
      { slug: "algorand", name: "Algorand" },
      { slug: "solana", name: "Solana" },
      { slug: "thorchain", name: "THORChain" },
      { slug: "avalanche", name: "Avalanche" },
      { slug: "near", name: "NEAR" },
      { slug: "nba-top-shot", name: "NBA Top Shot" },
      { slug: "nfl-all-day", name: "NFL All Day" },
      { slug: "laliga-golazos", name: "LaLiga Golazos" },
      { slug: "flowverse", name: "Flowverse" },
      { slug: "giglabs", name: "GigLabs" },
      { slug: "opensea", name: "Opensea" },
      { slug: "uniswap", name: "Uniswap" },
      { slug: "aave", name: "Aave" },
      { slug: "maker", name: "Maker" },
      { slug: "sushi", name: "Sushi" },
      { slug: "algo-fi", name: "AlgoFi" },
      { slug: "trader-joe", name: "Trader Joe" },
      { slug: "free-square", name: "Free Square" },
      { slug: "velodrome", name: "Velodrome" },
      { slug: "the-graph", name: "The Graph" },
      { slug: "in-the-news", name: "In the News" },
      { slug: "megadashboard", name: "Megadashboard" },
      { slug: "web3-course", name: "Web3 Course" },
      { slug: "gains-network", name: "Gains Network" },
      { slug: "flourine", name: "Flourine" },
      { slug: "squid", name: "Squid" },
      { slug: "magic-eden", name: "Magic Eden" },
      { slug: "metaplex", name: "Metaplex" },
      { slug: "loop-finance", name: "Loop Finance" },
      { slug: "makershaker", name: "MakerShaker" },
      { slug: "geniidata", name: "GeniiData" },
      { slug: "insurenimble", name: "InsureNimble " },
      { slug: "forta", name: "Forta" },
      { slug: "hop", name: "Hop" },
      { slug: "altlayer", name: "AltLayer" },
      { slug: "tokenflow", name: "TokenFlow" },
      { slug: "mars", name: "Mars" },
      { slug: "ion-dao", name: "ION DAO" },
      { slug: "icns", name: "ICNS" },
      { slug: "slingshot", name: "Slingshot" },
      { slug: "skip", name: "Skip" },
      { slug: "quasar", name: "Quasar" },
      { slug: "phase", name: "Phase" },
      { slug: "metricsdao", name: "MetricsDAO" },
    ],
    skipDuplicates: true,
  });

  await prisma.network.createMany({
    data: [{ name: "Polygon" }],
    skipDuplicates: true,
  });

  await prisma.token.createMany({
    data: [
      {
        name: "USD Coin",
        networkName: "Polygon",
        contractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC",
      },
    ],
  });

  // await seedLaborMarkets();
  // await seedServiceRequests(await prisma.laborMarket.findMany());
  // await seedSubmissions(await prisma.serviceRequest.findMany());
  // await seedReviews(await prisma.submission.findMany());
}

// async function seedLaborMarkets() {
//   const projectIds = (await prisma.project.findMany()).map((p) => p.id);
//   const tokenIds = (await prisma.token.findMany()).map((t) => t.id);
//   // create 15 fake labor markets in prisma
//   for (let i = 0; i < 15; i++) {
//     await upsertLaborMarket(
//       fakeLaborMarket({
//         projectIds: faker.helpers.arrayElements(faker.helpers.arrayElements(projectIds, 2)), // pick between 1-2 random projects
//         tokenIds: faker.helpers.arrayElements(tokenIds), // pick a subset of random tokens
//       })
//     );
//   }
// }

// create a fake service request for each labor market in Prisma
// async function seedServiceRequests(laborMarkets: LaborMarket[]) {
//   for (const laborMarket of laborMarkets) {
//     await upsertServiceRequest(
//       fakeServiceRequest({
//         laborMarketAddress: laborMarket.address,
//       })
//     );
//   }
// }

// async function seedSubmissions(serviceRequests: ServiceRequest[]) {
//   for (const serviceRequest of serviceRequests) {
//     // create 3 fake submissions for each Service Request in Prisma
//     for (let i = 0; i < 3; i++) {
//       const submission = fakeSubmission({
//         laborMarketAddress: serviceRequest.laborMarketAddress,
//         serviceRequestId: serviceRequest.contractId,
//       });
//       await upsertSubmission(submission);
//     }
//   }
// }

// async function seedReviews(allSubmissions: Submission[]) {
//   for (const submission of allSubmissions) {
//     // create 3 fake reviews for each submission in Prisma
//     for (let i = 0; i < 3; i++) {
//       await upsertReview(
//         fakeReview({
//           serviceRequestId: submission.serviceRequestId,
//           laborMarketAddress: submission.laborMarketAddress,
//           submissionId: submission.contractId,
//         })
//       );
//     }
//   }
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
