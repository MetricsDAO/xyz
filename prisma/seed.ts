import { prisma } from "~/services/prisma.server";

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
    data: [{ name: "Polygon" }, { name: "Ethereum" }],
    skipDuplicates: true,
  });

  await prisma.token.createMany({
    data: [
      {
        name: "Metrics Beta",
        networkName: "Polygon",
        decimals: 18,
        contractAddress: "0xe1805534B191029731907737042623e1bc6b87D8",
        symbol: "MBETA",
      },
      {
        name: "Metrics Beta 2",
        decimals: 18,
        networkName: "Polygon",
        contractAddress: "0xCce422781e1818821f50226C14E6289a7144a898",
        symbol: "MBETA2",
      },
      {
        name: "USDC",
        decimals: 6,
        networkName: "Polygon",
        contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        symbol: "USDC",
      },
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
