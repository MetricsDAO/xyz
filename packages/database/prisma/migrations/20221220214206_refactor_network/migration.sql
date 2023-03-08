/*
  Warnings:

  - The primary key for the `Network` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `networkId` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `networkId` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Network` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `networkName` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `networkName` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_networkId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_networkId_fkey";

-- DropIndex
DROP INDEX "Network_id_key";

-- AlterTable
ALTER TABLE "Network" DROP CONSTRAINT "Network_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Network_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "networkId",
ADD COLUMN     "networkName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "networkId",
ADD COLUMN     "networkName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Network_name_key" ON "Network"("name");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_networkName_fkey" FOREIGN KEY ("networkName") REFERENCES "Network"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_networkName_fkey" FOREIGN KEY ("networkName") REFERENCES "Network"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
