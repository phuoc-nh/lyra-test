/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Column` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Column` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Row` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Row` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `rowId` on the `Cell` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `columnId` on the `Cell` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_columnId_fkey";

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_rowId_fkey";

-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "rowId",
ADD COLUMN     "rowId" INTEGER NOT NULL,
DROP COLUMN "columnId",
ADD COLUMN     "columnId" INTEGER NOT NULL,
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Column" DROP CONSTRAINT "Column_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Column_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Row" DROP CONSTRAINT "Row_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Row_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "Row"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;
