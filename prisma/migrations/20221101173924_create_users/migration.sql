-- CreateTable
CREATE TABLE `User` (
    `address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_address_key`(`address`),
    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
