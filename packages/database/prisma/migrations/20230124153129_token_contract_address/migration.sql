/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[symbol,networkName]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractAddress` to the `Token` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_LaborMarketToToken" DROP CONSTRAINT "_LaborMarketToToken_B_fkey";

-- DropIndex
DROP INDEX "Token_symbol_key";

-- AlterTable
ALTER TABLE "Token" DROP CONSTRAINT "Token_pkey",
ADD COLUMN     "contractAddress" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_symbol_networkName_key" ON "Token"("symbol", "networkName");

-- AddForeignKey
ALTER TABLE "_LaborMarketToToken" ADD CONSTRAINT "_LaborMarketToToken_B_fkey" FOREIGN KEY ("B") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
