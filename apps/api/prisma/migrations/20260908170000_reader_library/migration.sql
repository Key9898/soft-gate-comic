-- CreateTable
CREATE TABLE "LibrarySubscribe" (
    "userId" TEXT NOT NULL,
    "webtoonId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "notifyMuted" BOOLEAN NOT NULL DEFAULT false,
    "lastNotifiedEpisodeNumber" INTEGER,

    CONSTRAINT "LibrarySubscribe_pkey" PRIMARY KEY ("userId","webtoonId")
);

-- CreateTable
CREATE TABLE "LibraryHistory" (
    "userId" TEXT NOT NULL,
    "webtoonId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL,
    "scrollRatio" DOUBLE PRECISION,
    "readEpisodeNumbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "LibraryHistory_pkey" PRIMARY KEY ("userId","webtoonId")
);

-- CreateTable
CREATE TABLE "LibraryLike" (
    "userId" TEXT NOT NULL,
    "webtoonId" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryLike_pkey" PRIMARY KEY ("userId","webtoonId")
);

-- AddForeignKey
ALTER TABLE "LibrarySubscribe" ADD CONSTRAINT "LibrarySubscribe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryHistory" ADD CONSTRAINT "LibraryHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryLike" ADD CONSTRAINT "LibraryLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
