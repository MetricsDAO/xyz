import type { Token } from "@prisma/client";
import { prisma } from "./prisma.server";

/**
 * updates a users wallet address.
 * @param {string} user - the user whos address should be updated.
 * @param {string} blockchain - the blockchain the wallet address lives on.
 * @param {string} walletAddress - the address of the wallet.
 */
export function updateWalletAddress(userId: string, walletAddress: string, newWalletAddress: string) {
  return prisma.wallet.update({
    where: {
      address: walletAddress,
    },
    data: {
      address: newWalletAddress,
      userId: userId,
    },
  });
}

/**
   * updates a users wallet address.
   * @param {string} user - the userId of the wallet owner.
   * @param {string} blockchain - the blockchain the wallet address lives on.
   * @param {string} walletAddress - the address of the wallet.
  
   * 
   */
export function addWalletAddress(walletAddress: string, Id: string, user: string) {
  return prisma.wallet.upsert({
    where: { address: walletAddress },
    update: { address: walletAddress },
    create: {
      address: walletAddress,
      networkId: Id,
      userId: user,
    },
  });
}

/**
 * deletes a wallet by its address.
 * @param {string} walletAddress - the address of the wallet.
 *
 */
export function deleteWalletAddress(walletAddress: string) {
  return prisma.wallet.delete({
    where: {
      address: walletAddress,
    },
  });
}

/**
 * find all wallets for a user.
 * @param {User} user - the user.
 * @returns {Promise<Wallet[]>} - the wallets for the user.
 */
export function findAllWalletsForUser(userId: string) {
  return prisma.wallet.findMany({
    where: {
      userId: userId,
    },
    include: {
      chain: true,
    },
  });
}

/**
 * Find the Network for a wallet.
 * @param {string} tokenSymbol - the user.
 * @returns {Promise<Network>} - the PayableBlockchain that the wallet lives on.
 */
export function findNetworkOfWallet(name: string) {
  return prisma.network.findFirst({
    where: {
      name: name,
    },
  });
}
