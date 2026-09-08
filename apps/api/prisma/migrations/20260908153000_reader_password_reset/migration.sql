-- CreateTable
CREATE TABLE "ReaderPasswordReset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderPasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReaderPasswordReset_tokenHash_key" ON "ReaderPasswordReset"("tokenHash");

-- AddForeignKey
ALTER TABLE "ReaderPasswordReset" ADD CONSTRAINT "ReaderPasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
