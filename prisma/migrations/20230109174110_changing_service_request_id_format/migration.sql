/*
  Warnings:

  - The primary key for the `ServiceRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `ServiceRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `laborMarketAddress` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `serviceRequestId` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_serviceRequestId_fkey";

-- DropIndex
DROP INDEX "ServiceRequest_id_key";

-- AlterTable
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL,
ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id", "laborMarketAddress");

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "laborMarketAddress" TEXT NOT NULL,
DROP COLUMN "serviceRequestId",
ADD COLUMN     "serviceRequestId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_laborMarketAddress_serviceRequestId_fkey" FOREIGN KEY ("laborMarketAddress", "serviceRequestId") REFERENCES "ServiceRequest"("laborMarketAddress", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
