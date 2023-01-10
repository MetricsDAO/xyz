/*
  Warnings:

  - You are about to drop the column `scoreStatus` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `scoreStatus` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `score` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "scoreStatus",
ADD COLUMN     "score" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "scoreStatus",
ADD COLUMN     "score" INTEGER;
