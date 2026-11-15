-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "linksBio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linksPhoto" TEXT,
ADD COLUMN     "linksShowCv" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linksShowPortfolio" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'auto',
    "image" TEXT,
    "size" TEXT NOT NULL DEFAULT 'small',
    "accent" TEXT NOT NULL DEFAULT 'default',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);
