/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RefreshToken` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;
