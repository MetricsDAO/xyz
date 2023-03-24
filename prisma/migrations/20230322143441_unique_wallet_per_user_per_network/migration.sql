/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,networkName]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "Transaction";

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_networkName_key" ON "Wallet"("userId", "networkName");
