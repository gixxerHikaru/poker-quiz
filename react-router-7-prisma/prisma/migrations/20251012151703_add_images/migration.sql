-- CreateTable
CREATE TABLE "public"."Images" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Images_visitId_idx" ON "public"."Images"("visitId");

-- AddForeignKey
ALTER TABLE "public"."Images" ADD CONSTRAINT "Images_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "public"."Visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
