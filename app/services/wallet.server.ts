import type { WalletAdd, WalletDelete } from "~/domain/wallet";
import { prisma } from "./prisma.server";

/**
 * updates a users wallet address.
 * @param {string} userId - the userId of the wallet owner.
 * @param {WalletAdd} input - the blockchain and address of the new wallet.
 * @returns {Promise<Wallet[] | Error>} - the wallets for the user or wallet already exists.

 */
export async function addWalletAddress(userId: string, input: WalletAdd) {
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
      id: input.id,
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
