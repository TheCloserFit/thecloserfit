/*
  Warnings:

  - Made the column `position` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "position" SET NOT NULL;
