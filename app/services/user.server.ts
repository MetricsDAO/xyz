import { prisma } from "./prisma.server";

/**
 * Finds a user by its wallet address.
 * @param {string} address - The address of the user to find.
 * @returns {Promise<User | null>} - The submission or null if not found.
 */
export const findUserByAddress = async (address: string) => {
  return prisma.user.findFirst({
    where: { address: address },
  });
};

export const createUser = async (address: string) => {
  return prisma.user.create({
    data: {
      address: address,
    },
  });
};
