-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'HIDDEN';

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false;
