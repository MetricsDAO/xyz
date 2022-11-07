/*
  Warnings:

  - You are about to drop the column `reviewerBadgerAddress` on the `LaborMarket` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerBadgerTokenId` on the `LaborMarket` table. All the data in the column will be lost.
  - Added the required column `reviewBadgerAddress` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewBadgerTokenId` to the `LaborMarket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LaborMarket` DROP COLUMN `reviewerBadgerAddress`,
    DROP COLUMN `reviewerBadgerTokenId`,
    ADD COLUMN `reviewBadgerAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewBadgerTokenId` VARCHAR(191) NOT NULL;
