import { prisma } from "./prisma.server";

export const listTokens = () => {
  return prisma.token.findMany();
};
