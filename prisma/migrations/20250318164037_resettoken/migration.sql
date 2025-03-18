-- CreateTable
CREATE TABLE "ResetToken" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_userId_key" ON "ResetToken"("userId");
