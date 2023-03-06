/*
  Warnings:

  - Added the required column `enforcementExpiration` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signalExpiration` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionExpiration` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "enforcementExpiration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "signalExpiration" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submissionExpiration" TIMESTAMP(3) NOT NULL;
