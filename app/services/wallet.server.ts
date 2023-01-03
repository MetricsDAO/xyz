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
 * Checks if the wallet exists.
 * @param {string} address - the blockchain and address of the wallet.
 * @returns {Promise<Wallet[] | null>} - the wallets for the user or wallet already exists.

 */
export async function walletExists(address: string) {
  return prisma.wallet.findUnique({
    where: {
      address: address,
    },
  });
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
