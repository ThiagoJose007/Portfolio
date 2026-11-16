-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "unlockProtected" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "translations_locale_idx" ON "translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "translations_entity_entityId_field_locale_key" ON "translations"("entity", "entityId", "field", "locale");
