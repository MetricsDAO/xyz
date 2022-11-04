import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  // Temporary. Seeing intermittent "can't reach database server" and "time out fetching from connection pool" errors
  // prisma = new PrismaClient();
  // prisma.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prisma = global.__db;
}

export { prisma };
