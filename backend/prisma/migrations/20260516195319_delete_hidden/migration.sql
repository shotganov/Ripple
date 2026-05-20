/*
  Warnings:

  - The values [HIDDEN] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_hidden` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `is_hidden` on the `posts` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('LIKE', 'FOLLOW', 'COMMENT');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "is_hidden";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "is_hidden";
