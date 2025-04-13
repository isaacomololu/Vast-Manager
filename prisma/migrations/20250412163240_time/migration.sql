/*
  Warnings:

  - You are about to drop the column `duration` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "duration",
DROP COLUMN "time",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
