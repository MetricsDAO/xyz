/*
  Warnings:

  - Added the required column `description` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "description" TEXT NOT NULL;
