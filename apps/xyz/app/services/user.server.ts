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

/**
 * Finds a user by its id in our database.
 * @param {string} id - The id of the user to find.
 * @returns {Promise<User | null>} - The User or null if not found.
 */
export const findUserById = async (id: string) => {
  return prisma.user.findFirst({
    where: { id: id },
    include: {
      wallet: true,
    },
  });
};

export const createUser = async (address: string) => {
  return prisma.user.create({
    data: {
      address: address,
    },
  });
};
