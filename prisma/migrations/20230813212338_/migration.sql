/*
  Warnings:

  - You are about to drop the column `feedback` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "feedback" TEXT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "feedback",
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "weaknesses" TEXT[];
