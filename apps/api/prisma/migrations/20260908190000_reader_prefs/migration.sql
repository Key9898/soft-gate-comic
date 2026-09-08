-- CreateEnum
CREATE TYPE "ReaderFontSize" AS ENUM ('sm', 'md', 'lg');

-- CreateEnum
CREATE TYPE "ReaderImageFit" AS ENUM ('fit', 'full');

-- CreateTable
CREATE TABLE "ReaderUserPrefs" (
    "userId" TEXT NOT NULL,
    "newEpisode" BOOLEAN NOT NULL DEFAULT true,
    "commentReply" BOOLEAN NOT NULL DEFAULT true,
    "promotion" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "brightness" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "fontSize" "ReaderFontSize" NOT NULL DEFAULT 'md',
    "imageFit" "ReaderImageFit" NOT NULL DEFAULT 'fit',

    CONSTRAINT "ReaderUserPrefs_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "ReaderUserPrefs" ADD CONSTRAINT "ReaderUserPrefs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
