import { findProjectsBySlug as findProjectsBySlugHelper } from "~/utils/helpers";
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
  const allProjects = await listProjects();
  return findProjectsBySlugHelper(allProjects, slugs);
};
