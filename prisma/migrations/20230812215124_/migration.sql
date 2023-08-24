/*
  Warnings:

  - The values [behavioral] on the enum `InterviewType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewType_new" AS ENUM ('technical', 'behavioural', 'mixed');
ALTER TABLE "Interview" ALTER COLUMN "type" TYPE "InterviewType_new" USING ("type"::text::"InterviewType_new");
ALTER TYPE "InterviewType" RENAME TO "InterviewType_old";
ALTER TYPE "InterviewType_new" RENAME TO "InterviewType";
DROP TYPE "InterviewType_old";
COMMIT;
