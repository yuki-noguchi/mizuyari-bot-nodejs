-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('STAND_BY', 'PROCESSING');

-- CreateEnum
CREATE TYPE "wartering_status" AS ENUM ('WAITING_FOR_PLANT_NAME', 'WAITING_FOR_FREQUENCY_IN_DAYS', 'WAITING_FOR_NEXT_DATE', 'COMPLETED');

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(100) NOT NULL,
    "status" "user_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watering" (
    "id" BIGSERIAL NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "status" "wartering_status" NOT NULL,
    "plant_name" VARCHAR(100),
    "frequency_in_days" INTEGER,
    "next_date_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watering_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "watering_plant_name_idx" ON "watering"("plant_name");

-- AddForeignKey
ALTER TABLE "watering" ADD CONSTRAINT "watering_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
