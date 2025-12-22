/*
  Warnings:

  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';
