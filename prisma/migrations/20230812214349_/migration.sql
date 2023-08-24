/*
  Warnings:

  - You are about to drop the column `title` on the `Interview` table. All the data in the column will be lost.
  - Made the column `type` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "title",
ADD COLUMN     "finished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "position" TEXT,
ALTER COLUMN "type" SET NOT NULL;
