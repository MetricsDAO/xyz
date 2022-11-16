import { prisma } from "./prisma.server";

export const listProjects = () => {
  return prisma.project.findMany();
};
