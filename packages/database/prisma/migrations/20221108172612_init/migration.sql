-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "address" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "LaborMarket" (
    "address" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "launchAccess" TEXT NOT NULL,
    "launchBadgerAddress" TEXT,
    "launchBadgerTokenId" TEXT,
    "rewardCurveAddress" TEXT NOT NULL,
    "submitRepMin" INTEGER NOT NULL,
    "submitRepMax" INTEGER NOT NULL,
    "reviewBadgerAddress" TEXT NOT NULL,
    "reviewBadgerTokenId" TEXT NOT NULL,
    "sponsorAddress" TEXT NOT NULL,

    CONSTRAINT "LaborMarket_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "laborMarketAddress" TEXT NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LaborMarketToToken" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LaborMarketToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Token_symbol_key" ON "Token"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "LaborMarket_address_key" ON "LaborMarket"("address");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_id_key" ON "ServiceRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_id_key" ON "Submission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_LaborMarketToToken_AB_unique" ON "_LaborMarketToToken"("A", "B");

-- CreateIndex
CREATE INDEX "_LaborMarketToToken_B_index" ON "_LaborMarketToToken"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LaborMarketToProject_AB_unique" ON "_LaborMarketToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_LaborMarketToProject_B_index" ON "_LaborMarketToProject"("B");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_laborMarketAddress_fkey" FOREIGN KEY ("laborMarketAddress") REFERENCES "LaborMarket"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaborMarketToToken" ADD CONSTRAINT "_LaborMarketToToken_A_fkey" FOREIGN KEY ("A") REFERENCES "LaborMarket"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaborMarketToToken" ADD CONSTRAINT "_LaborMarketToToken_B_fkey" FOREIGN KEY ("B") REFERENCES "Token"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaborMarketToProject" ADD CONSTRAINT "_LaborMarketToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "LaborMarket"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaborMarketToProject" ADD CONSTRAINT "_LaborMarketToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
