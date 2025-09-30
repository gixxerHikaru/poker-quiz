-- CreateTable
CREATE TABLE "public"."Prefectures" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,

    CONSTRAINT "Prefectures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Visits" (
    "id" SERIAL NOT NULL,
    "visitFromDate" TIMESTAMP(3) NOT NULL,
    "visitToDate" TIMESTAMP(3) NOT NULL,
    "prefectureId" INTEGER NOT NULL,

    CONSTRAINT "Visits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Visits" ADD CONSTRAINT "Visits_prefectureId_fkey" FOREIGN KEY ("prefectureId") REFERENCES "public"."Prefectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
