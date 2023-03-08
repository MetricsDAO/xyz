/*
  Warnings:

  - You are about to drop the `LaborMarket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LaborMarketToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LaborMarketToToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_submissionId_laborMarketAddress_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_laborMarketAddress_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey";

-- DropForeignKey
ALTER TABLE "_LaborMarketToProject" DROP CONSTRAINT "_LaborMarketToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_LaborMarketToProject" DROP CONSTRAINT "_LaborMarketToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_LaborMarketToToken" DROP CONSTRAINT "_LaborMarketToToken_A_fkey";

-- DropForeignKey
ALTER TABLE "_LaborMarketToToken" DROP CONSTRAINT "_LaborMarketToToken_B_fkey";

-- DropTable
DROP TABLE "LaborMarket";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "ServiceRequest";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "_LaborMarketToProject";

-- DropTable
DROP TABLE "_LaborMarketToToken";
