import { prisma } from "./prisma.server";

export const listProjects = () => {
  return prisma.project.findMany();
};

/**
 * Find projects by slug
 * @param slugs array
 * @returns {Promise<Project>}
 */
export const findProjectsBySlug = async (slugs: string[]) => {
  return prisma.project.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });
};
