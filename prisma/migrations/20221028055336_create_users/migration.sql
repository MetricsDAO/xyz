-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
