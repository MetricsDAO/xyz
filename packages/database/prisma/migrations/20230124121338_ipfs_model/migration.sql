-- CreateTable
CREATE TABLE "IpfsMetadata" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "url" TEXT,
    "sizeBytes" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "IpfsMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IpfsMetadata_hash_key" ON "IpfsMetadata"("hash");

-- AddForeignKey
ALTER TABLE "IpfsMetadata" ADD CONSTRAINT "IpfsMetadata_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
