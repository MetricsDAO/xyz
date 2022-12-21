import { prisma } from "./prisma.server";

/**
 * Find the Network by its name.
 * @param {string} name - the Id of the Network.
 * @returns {Promise<Network>} - the PayableBlockchain that the wallet lives on.
 */
export function findNetworkByName(name: string) {
  return prisma.network.findUnique({
    where: {
      name: name,
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
