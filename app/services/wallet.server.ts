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
  return prisma.wallet.create({
    data: {
      address: walletAddress,
      payableBlockchainId: Id,
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
  });
}

/**
 * Find the PayableBlockchain for a wallet.
 * @param {string} tokenSymbol - the user.
 * @returns {Promise<PayableBlockchain>} - the PayableBlockchain that the wallet lives on.
 */
export function findBlockchainOfWallet(tokenSymbol: string) {
  return prisma.payableBlockchain.findFirst({
    where: {
      tokenSymbol: tokenSymbol,
    },
  });
}
