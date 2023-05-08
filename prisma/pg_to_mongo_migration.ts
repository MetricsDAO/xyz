import { prisma } from "~/services/prisma.server";
import postgres from "postgres";

const POSTGRES_URL = "";

// This was used to migrate from Postgres to MongoDB and consolidate to 1 DB. Can delete this one day in the future.
async function main() {
  const sql = postgres(POSTGRES_URL, {
    ssl: "require",
  });

  const userQuery = await sql`SELECT * FROM "User"`;

  const usersCreated = await prisma.user.createMany({
    data: userQuery.map((r) => {
      return {
        id: r.id,
        address: r.address,
        createdAt: r.createdAt,
      };
    }),
  });

  console.log("usersCreated", usersCreated);

  const walletQuery = await sql`SELECT * FROM "Wallet"`;

  const walletsCreated = await prisma.wallet.createMany({
    data: walletQuery.map((r) => {
      return {
        address: r.address,
        userId: r.userId,
        createdAt: r.createdAt,
        networkName: r.networkName,
      };
    }),
  });

  console.log("walletsCreated", walletsCreated);

  sql.end();
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
