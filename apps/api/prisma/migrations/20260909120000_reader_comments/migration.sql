-- CreateTable
CREATE TABLE "ReaderComment" (
    "id" TEXT NOT NULL,
    "episodeKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "spoiler" BOOLEAN NOT NULL DEFAULT false,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderCommentLike" (
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReaderCommentLike_pkey" PRIMARY KEY ("commentId","userId")
);

-- CreateIndex
CREATE INDEX "ReaderComment_episodeKey_idx" ON "ReaderComment"("episodeKey");

-- AddForeignKey
ALTER TABLE "ReaderComment" ADD CONSTRAINT "ReaderComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderCommentLike" ADD CONSTRAINT "ReaderCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ReaderComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderCommentLike" ADD CONSTRAINT "ReaderCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
