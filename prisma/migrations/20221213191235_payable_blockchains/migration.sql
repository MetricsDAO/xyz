/*
  Warnings:

  - You are about to drop the column `chain` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `isConnected` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `payableBlockchainId` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payableBlockchainId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "payableBlockchainId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "chain",
DROP COLUMN "isConnected",
ADD COLUMN     "payableBlockchainId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PayableBlockchain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,

    CONSTRAINT "PayableBlockchain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayableBlockchain_id_key" ON "PayableBlockchain"("id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_payableBlockchainId_fkey" FOREIGN KEY ("payableBlockchainId") REFERENCES "PayableBlockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_payableBlockchainId_fkey" FOREIGN KEY ("payableBlockchainId") REFERENCES "PayableBlockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
