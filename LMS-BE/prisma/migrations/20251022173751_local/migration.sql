/*
  Warnings:

  - You are about to drop the `course_in_path` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."course_in_path" DROP CONSTRAINT "course_in_path_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_in_path" DROP CONSTRAINT "course_in_path_learningPathId_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "learningPathId" INTEGER,
ALTER COLUMN "publishedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."course_in_path";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;
