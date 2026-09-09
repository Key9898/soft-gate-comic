-- CreateTable
CREATE TABLE "ReaderPushSubscription" (
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,

    CONSTRAINT "ReaderPushSubscription_pkey" PRIMARY KEY ("userId","endpoint")
);

-- CreateTable
CREATE TABLE "ReaderNotificationCampaign" (
    "id" TEXT NOT NULL,
    "type" "ReaderNotificationType" NOT NULL,
    "titleKey" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "inbox" INTEGER NOT NULL,
    "emailed" INTEGER NOT NULL,
    "pushed" INTEGER NOT NULL,
    "skippedPref" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderNotificationCampaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReaderPushSubscription" ADD CONSTRAINT "ReaderPushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ReaderUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
