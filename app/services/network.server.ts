import { prisma } from "./prisma.server";

/**
 * Find the Network by its Id.
 * @param {string} networkId - the Id of the Network.
 * @returns {Promise<Network>} - the PayableBlockchain that the wallet lives on.
 */
export function findNetworkById(id: string) {
  return prisma.network.findUnique({
    where: {
      id: id,
    },
  });
}

/**
 * list all Networks.
 * @returns {Promise<Network[]>} - the list of Networks.
 */
export function listNetworks() {
  return prisma.network.findMany();
}
