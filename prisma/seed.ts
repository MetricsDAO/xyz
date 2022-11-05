import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  await prisma.token.createMany({
    data: [
      { symbol: "ETH", name: "Ethereum" },
      { symbol: "SOL", name: "Solana" },
      { symbol: "USDC", name: "USD Coin" },
      { symbol: "MATIC", name: "Polygon" },
      { symbol: "AXL", name: "Axelar" },
      { symbol: "NEAR", name: "Near" },
      { symbol: "FLOW", name: "Flow" },
      { symbol: "AVAX", name: "Avalanche" },
    ],
  });
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
