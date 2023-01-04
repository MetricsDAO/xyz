import type { WalletAdd, WalletDelete } from "~/domain/wallet";
import { prisma } from "./prisma.server";

/**
 * Checks if the wallet exists.
 * @param  address - the blockchain and address of the wallet.
 * @returns boolean - the wallets for the user or wallet already exists.

 */
export async function walletExists(address: string) {
  const walletsCount = await prisma.wallet.count({ where: { address } });
  return walletsCount > 0;
}

/**
 * updates a users wallet address.
 * @param {string} userId - the userId of the wallet owner.
 * @param {WalletAdd} input - the blockchain and address of the new wallet.
 * @returns {Promise<Wallet[] | Error>} - the wallets for the user or wallet already exists.

 */
export async function addWalletAddress(userId: string, input: WalletAdd) {
  // const alreadyExists = prisma.wallet.findUnique({
  //   where: {
  //     address: input.payment.address,
  //   },
  // });
  // if (await alreadyExists) {
  //   return new Error("Wallet already exists.");
  // }
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
