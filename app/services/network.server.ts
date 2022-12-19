import { prisma } from "./prisma.server";

/**
 * Find the Network by its Id.
 * @param {string} networkId - the Id of the Network.
 * @returns {Promise<Network>} - the PayableBlockchain that the wallet lives on.
 */
export function findNetworkByNetworkId(networkId: string) {
  return prisma.network.findUnique({
    where: {
      id: networkId,
    },
  });
}
