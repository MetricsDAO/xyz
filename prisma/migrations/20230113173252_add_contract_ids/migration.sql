/*
  Warnings:

  - The primary key for the `ServiceRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[contractId,laborMarketAddress]` on the table `ServiceRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[laborMarketAddress,contractId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractId` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Made the column `score` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_submissionId_serviceRequestId_laborMarketAddress_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey";

-- DropIndex
DROP INDEX "LaborMarket_address_key";

-- DropIndex
DROP INDEX "Review_id_key";

-- DropIndex
DROP INDEX "Token_symbol_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "contractId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_pkey",
ADD COLUMN     "contractId" TEXT NOT NULL,
ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
ADD COLUMN     "contractId" TEXT NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_contractId_laborMarketAddress_key" ON "ServiceRequest"("contractId", "laborMarketAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_laborMarketAddress_contractId_key" ON "Submission"("laborMarketAddress", "contractId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_laborMarketAddress_fkey" FOREIGN KEY ("submissionId", "laborMarketAddress") REFERENCES "Submission"("contractId", "laborMarketAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_serviceRequestId_laborMarketAddress_fkey" FOREIGN KEY ("serviceRequestId", "laborMarketAddress") REFERENCES "ServiceRequest"("contractId", "laborMarketAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_laborMarketAddress_fkey" FOREIGN KEY ("laborMarketAddress") REFERENCES "LaborMarket"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
