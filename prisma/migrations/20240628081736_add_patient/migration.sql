-- AlterTable
ALTER TABLE "PatientDetails" ALTER COLUMN "historyOfMentalIssue" DROP NOT NULL,
ALTER COLUMN "whenProblemStart" DROP NOT NULL,
ALTER COLUMN "timeOfSleepHourly" DROP NOT NULL,
ALTER COLUMN "notInterested" DROP NOT NULL;
