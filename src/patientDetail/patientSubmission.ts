import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.use(express.json());

// Route to handle form submission and save patient details
router.post('/api/patient-details', async (req, res) => {
  const {
    familyMember,
    age,
    gender,
    contactNumber,
    historyOfMentalIssue,
    symptoms,
    diagnosis,
    treatment,
    whichFamilyMember,
    symptomsOfPatient,
    whenProblemStart,
    previousPatientTreatment,
    freqOfSymptoms,
    triggerPoint,
    capacityOfWork,
    sleepProper,
    timeOfSleepHourly,
    eatingProperly,
    interestedToDoSomething,
    notInterested,
    qualityTimeForThemselves,
    noThemselves,
    doctorId
  } = req.body;

  try {
    // Save patient details to the database using Prisma
    const newPatient = await prisma.patientDetails.create({
      data: {
        familyMember,
        age,
        gender,
        contactNumber,
        historyOfMentalIssue,
        symptoms,
        diagnosis,
        treatment,
        whichFamilyMember,
        symptomsOfPatient,
        whenProblemStart,
        previousPatientTreatment,
        freqOfSymptoms,
        triggerPoint,
        capacityOfWork,
        sleepProper,
        timeOfSleepHourly,
        eatingProperly,
        interestedToDoSomething,
        notInterested,
        qualityTimeForThemselves,
        noThemselves,
        doctorId
      },
    });

    res.status(201).json({ message: 'Patient details saved successfully', data: newPatient });
  } catch (error) {
    console.error('Error saving patient details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
export default router;
