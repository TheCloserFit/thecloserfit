/*
  Warnings:

  - You are about to drop the column `cv` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cv",
ADD COLUMN     "resume" TEXT;
