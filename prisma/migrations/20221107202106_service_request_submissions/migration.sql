-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_serviceRequestId_fkey` FOREIGN KEY (`serviceRequestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
