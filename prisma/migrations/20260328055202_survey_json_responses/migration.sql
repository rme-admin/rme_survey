-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'FACULTY', 'RESEARCH_SCHOLAR', 'INDUSTRY_PERSONNEL', 'OTHER');

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "statement_a" TEXT NOT NULL,
    "statement_b" TEXT NOT NULL,
    "option_a" TEXT NOT NULL DEFAULT 'Completely Agree',
    "option_b" TEXT NOT NULL DEFAULT 'Sometimes',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "designation" "Designation" NOT NULL,
    "institute" TEXT NOT NULL,
    "email" TEXT,
    "phone" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
