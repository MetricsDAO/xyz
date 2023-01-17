/*
  Warnings:

  - The primary key for the `ServiceRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `laborMarketAddress` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceRequestId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laborMarketAddress` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_serviceRequestId_fkey";

-- DropIndex
DROP INDEX "Submission_id_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "laborMarketAddress" TEXT NOT NULL,
ADD COLUMN     "serviceRequestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_pkey",
ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id", "laborMarketAddress");

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
ADD COLUMN     "laborMarketAddress" TEXT NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id", "serviceRequestId", "laborMarketAddress");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_serviceRequestId_laborMarketAddress_fkey" FOREIGN KEY ("submissionId", "serviceRequestId", "laborMarketAddress") REFERENCES "Submission"("id", "serviceRequestId", "laborMarketAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey" FOREIGN KEY ("laborMarketAddress", "serviceRequestId") REFERENCES "ServiceRequest"("laborMarketAddress", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
