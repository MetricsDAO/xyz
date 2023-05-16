import { prisma } from "./prisma.server";

export function findAllRewardsForUser(userId: string) {
  return prisma.reward.findMany({
    where: {
      userId: userId,
    },
    include: {
      token: true,
    },
  });
}
