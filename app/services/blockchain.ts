import { prisma } from "./prisma.server";

/**
 * deletes a payable blockchain by its ID.
 * @param {string} id - the Id of the blockchain.
 *
 */
export function findBlockchainById(id: string) {
  return prisma.network.findFirst({
    where: {
      id: id,
    },
  });
}
