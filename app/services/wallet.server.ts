import type { User } from "@prisma/client";
import { prisma } from "./prisma.server";

/**
 * updates a users wallet address.
 * @param {string} user - the user whos address should be updated.
 * @param {string} blockchain - the blockchain the wallet address lives on.
 * @param {string} walletAddress - the address of the wallet.
 */
export function updateWalletAddress(user: User, blockchain: string, walletAddress?: string) {
  return prisma.wallet.update({
    where: {
      address: walletAddress,
    },
    data: {
      address: walletAddress,
      chain: blockchain,
      userId: user.id,
    },
  });
}

/**
   * updates a users wallet address.
   * @param {string} user - the user whos address should be updated.
   * @param {string} blockchain - the blockchain the wallet address lives on.
   * @param {string} walletAddress - the address of the wallet.
   * @param {boolean} isConnected - is the wallet currently connected.
  
   * 
   */
export function addWalletAddress(user: User, blockchain: string, walletAddress: string, isConnected: boolean) {
  return prisma.wallet.create({
    data: {
      address: walletAddress,
      chain: blockchain,
      userId: user.id,
      isConnected,
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
export function findAllWalletsForUser(user: User) {
  return prisma.wallet.findMany({
    where: {
      userId: user.id,
    },
  });
}
