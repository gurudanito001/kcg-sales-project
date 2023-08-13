/*
  Warnings:

  - You are about to drop the column `department` on the `ContactPerson` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `ContactPerson` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ContactPerson` table. All the data in the column will be lost.
  - Added the required column `name` to the `ContactPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactPerson" DROP COLUMN "department",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" VARCHAR(50) NOT NULL;
