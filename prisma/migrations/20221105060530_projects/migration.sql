-- CreateTable
CREATE TABLE `_LaborMarketToProject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LaborMarketToProject_AB_unique`(`A`, `B`),
    INDEX `_LaborMarketToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LaborMarketToProject` ADD CONSTRAINT `_LaborMarketToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `LaborMarket`(`address`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LaborMarketToProject` ADD CONSTRAINT `_LaborMarketToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
