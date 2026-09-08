-- CreateEnum
CREATE TYPE "ReaderNotificationType" AS ENUM ('new_episode', 'comment_reply', 'system', 'promotion');

-- CreateTable
CREATE TABLE "ReaderNotification" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "ReaderNotificationType" NOT NULL,
    "titleKey" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "href" TEXT,
    "webtoonId" TEXT,
    "episodeNumber" INTEGER,

    CONSTRAINT "ReaderNotification_pkey" PRIMARY KEY ("userId","id")
);

-- AddForeignKey
ALTER TABLE "ReaderNotification" ADD CONSTRAINT "ReaderNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
