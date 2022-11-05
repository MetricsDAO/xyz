/*
  Warnings:

  - Added the required column `launchAccess` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `launchBadgerAddress` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `launchBadgerTokenId` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerBadgerAddress` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerBadgerTokenId` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardCurveAddress` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardTokens` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sponsorAddress` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitRepMax` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitRepMin` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isConnected` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LaborMarket` ADD COLUMN `launchAccess` VARCHAR(191) NOT NULL,
    ADD COLUMN `launchBadgerAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `launchBadgerTokenId` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewerBadgerAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewerBadgerTokenId` VARCHAR(191) NOT NULL,
    ADD COLUMN `rewardCurveAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `rewardTokens` VARCHAR(191) NOT NULL,
    ADD COLUMN `sponsorAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `submitRepMax` INTEGER NOT NULL,
    ADD COLUMN `submitRepMin` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` ADD COLUMN `isConnected` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE FULLTEXT INDEX `LaborMarket_title_description_idx` ON `LaborMarket`(`title`, `description`);
