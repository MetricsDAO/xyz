import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.server";
import ChallengeService from "./challenges-service.server";

type Services = {
  challenge: ChallengeService;
  prisma: PrismaClient;
};

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const challenge = new ChallengeService(prisma);

  return fn({
    prisma,
    challenge,
  });
}

export { withServices };
