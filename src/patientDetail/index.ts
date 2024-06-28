import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json()); // Middleware to parse JSON bodies

router.post('/patient/details', async (req, res) => {
  try {
    const {
      selectSlot,
      doctorEmail,
      doctorName,
      doctorId,
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
      noThemselves
    } = req.body;

    // Fetch the doctor based on the provided identifier
    let doctor;
    if (doctorId) {
      doctor = await prisma.doctor.findUnique({ where: {id: parseInt(doctorId, 10)} });
    } else if (doctorEmail) {
      doctor = await prisma.doctor.findUnique({ where: { email: doctorEmail } });
    } else if (doctorName) {
      doctor = await prisma.doctor.findFirst({ where: { name: doctorName } });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patientDetails = await prisma.patientDetails.create({
      data: {
        selectSlot,
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
        doctorId: doctor.id
      }
    });

    res.status(201).json(patientDetails);
  } catch (error) {
    console.error('Error saving patient details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
