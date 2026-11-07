-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "firstViewedAt" TIMESTAMP(3),
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastViewedAt" TIMESTAMP(3),
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "application_experiences" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "customSummary" TEXT,
    "customHighlights" JSONB,

    CONSTRAINT "application_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_experiences_applicationId_experienceId_key" ON "application_experiences"("applicationId", "experienceId");

-- AddForeignKey
ALTER TABLE "application_experiences" ADD CONSTRAINT "application_experiences_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_experiences" ADD CONSTRAINT "application_experiences_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
