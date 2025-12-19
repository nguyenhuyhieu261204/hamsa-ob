-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tag" TEXT,
    "internalReference" TEXT,
    "shop" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "bundlePrice" REAL,
    "originalPrice" REAL
);

-- CreateTable
CREATE TABLE "BundleItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "bundlePrice" REAL,
    "sortPriority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Bundle_shop_idx" ON "Bundle"("shop");

-- CreateIndex
CREATE INDEX "Bundle_isPublished_idx" ON "Bundle"("isPublished");

-- CreateIndex
CREATE INDEX "Bundle_startDate_idx" ON "Bundle"("startDate");

-- CreateIndex
CREATE INDEX "Bundle_endDate_idx" ON "Bundle"("endDate");

-- CreateIndex
CREATE INDEX "Bundle_internalReference_idx" ON "Bundle"("internalReference");
