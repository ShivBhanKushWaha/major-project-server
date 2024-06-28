/*
  Warnings:

  - You are about to drop the column `instituteName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `Doctor` table. All the data in the column will be lost.
  - The `availability` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `instituteNamePg` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteNameUg` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "instituteName",
DROP COLUMN "timeSlot",
ADD COLUMN     "instituteNamePg" TEXT NOT NULL,
ADD COLUMN     "instituteNameUg" TEXT NOT NULL,
DROP COLUMN "availability",
ADD COLUMN     "availability" TEXT[];
