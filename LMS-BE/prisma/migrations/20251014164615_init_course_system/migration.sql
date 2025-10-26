-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "icon" TEXT,
    "videoType" TEXT,
    "video" TEXT,
    "oldPrice" INTEGER,
    "price" INTEGER,
    "preOrderPrice" INTEGER,
    "studentsCount" INTEGER,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "isSelling" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "userProgress" INTEGER DEFAULT 0,
    "lastCompletedAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "iconUrl" TEXT,
    "videoUrl" TEXT,
    "isComingSoon" BOOLEAN NOT NULL DEFAULT false,
    "isPreOrder" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "relatedCourses" JSONB,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_in_path" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "learningPathId" INTEGER NOT NULL,
    "orderIndex" INTEGER,

    CONSTRAINT "course_in_path_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_slug_key" ON "learning_paths"("slug");

-- CreateIndex
CREATE INDEX "course_in_path_learningPathId_idx" ON "course_in_path"("learningPathId");

-- CreateIndex
CREATE INDEX "course_in_path_courseId_idx" ON "course_in_path"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_in_path_courseId_learningPathId_key" ON "course_in_path"("courseId", "learningPathId");

-- AddForeignKey
ALTER TABLE "course_in_path" ADD CONSTRAINT "course_in_path_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_in_path" ADD CONSTRAINT "course_in_path_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
