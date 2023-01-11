/*
  Warnings:

  - The primary key for the `ServiceRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ServiceRequest` table. All the data in the column will be lost.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Submission` table. All the data in the column will be lost.
  - The required column `internalId` was added to the `ServiceRequest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `internalId` was added to the `Submission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `score` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_submissionId_serviceRequestId_laborMarketAddress_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey";

-- AlterTable
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "internalId" TEXT NOT NULL,
ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("internalId", "laborMarketAddress");

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
DROP COLUMN "id",
ADD COLUMN     "internalId" TEXT NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("internalId", "laborMarketAddress");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_laborMarketAddress_fkey" FOREIGN KEY ("submissionId", "laborMarketAddress") REFERENCES "Submission"("internalId", "laborMarketAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey" FOREIGN KEY ("laborMarketAddress", "serviceRequestId") REFERENCES "ServiceRequest"("laborMarketAddress", "internalId") ON DELETE RESTRICT ON UPDATE CASCADE;
