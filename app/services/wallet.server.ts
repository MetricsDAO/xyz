import type { WalletAdd, WalletDelete, WalletUpdate } from "~/domain/wallet";
import { prisma } from "./prisma.server";

/**
 * updates a users wallet address.
 * @param {string} userId - the id of the user.
 * @param {WalletUpdate} input - the new address and network of the wallet.

 */
export function updateWalletAddress(userId: string, input: WalletUpdate) {
  return prisma.wallet.update({
    where: {
      address: input.currentAddress,
    },
    data: {
      address: input.payment.address,
      userId: userId,
      networkName: input.payment.networkName,
    },
  });
}

/**
 * updates a users wallet address.
 * @param {string} userId - the userId of the wallet owner.
 * @param {WalletAdd} input - the blockchain and address of the new wallet.
 *
 */
export function addWalletAddress(userId: string, input: WalletAdd) {
  return prisma.wallet.create({
    data: {
      address: input.payment.address,
      networkName: input.payment.networkName,
      userId: userId,
    },
  });
}

/**
 * deletes a wallet by its address.
 * @param {WalletDelete} input - the address of the wallet to delete.
 *
 */
export function deleteWalletAddress(input: WalletDelete) {
  return prisma.wallet.delete({
    where: {
      address: input.currentAddress,
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
