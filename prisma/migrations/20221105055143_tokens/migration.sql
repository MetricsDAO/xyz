/*
  Warnings:

  - You are about to drop the column `rewardTokens` on the `LaborMarket` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `from` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_userId_fkey`;

-- AlterTable
ALTER TABLE `LaborMarket` DROP COLUMN `rewardTokens`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `userId`,
    ADD COLUMN `from` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Token` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Token_symbol_key`(`symbol`),
    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LaborMarketToToken` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LaborMarketToToken_AB_unique`(`A`, `B`),
    INDEX `_LaborMarketToToken_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LaborMarketToToken` ADD CONSTRAINT `_LaborMarketToToken_A_fkey` FOREIGN KEY (`A`) REFERENCES `LaborMarket`(`address`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LaborMarketToToken` ADD CONSTRAINT `_LaborMarketToToken_B_fkey` FOREIGN KEY (`B`) REFERENCES `Token`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
