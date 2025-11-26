/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Lesson` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `Result` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `age` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `present` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exam" DROP CONSTRAINT "Exam_gradeId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "gradeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
ADD COLUMN     "present" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "gradeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content",
ADD COLUMN     "day" "Day" NOT NULL;

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "age",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "age",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
