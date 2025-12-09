-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);
