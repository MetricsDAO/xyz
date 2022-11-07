-- AddForeignKey
ALTER TABLE `ServiceRequest` ADD CONSTRAINT `ServiceRequest_laborMarketAddress_fkey` FOREIGN KEY (`laborMarketAddress`) REFERENCES `LaborMarket`(`address`) ON DELETE RESTRICT ON UPDATE CASCADE;
