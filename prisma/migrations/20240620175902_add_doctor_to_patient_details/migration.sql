-- CreateTable
CREATE TABLE "PatientDetails" (
    "id" SERIAL NOT NULL,
    "familyMember" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "historyOfMentalIssue" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "whichFamilyMember" TEXT NOT NULL,
    "symptomsOfPatient" TEXT NOT NULL,
    "whenProblemStart" TEXT NOT NULL,
    "previousPatientTreatment" TEXT NOT NULL,
    "freqOfSymptoms" TEXT NOT NULL,
    "triggerPoint" TEXT NOT NULL,
    "capacityOfWork" TEXT NOT NULL,
    "sleepProper" BOOLEAN NOT NULL,
    "timeOfSleepHourly" INTEGER NOT NULL,
    "eatingProperly" BOOLEAN NOT NULL,
    "interestedToDoSomething" BOOLEAN NOT NULL,
    "notInterested" TEXT NOT NULL,
    "qualityTimeForThemselves" BOOLEAN NOT NULL,
    "noThemselves" BOOLEAN NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "PatientDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientDetails" ADD CONSTRAINT "PatientDetails_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
