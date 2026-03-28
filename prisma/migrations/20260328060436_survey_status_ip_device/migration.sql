-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('completed', 'inprogress');

-- AlterTable
ALTER TABLE "survey_responses" ADD COLUMN     "device" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "status" "SurveyStatus" NOT NULL DEFAULT 'inprogress',
ALTER COLUMN "endTime" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;
