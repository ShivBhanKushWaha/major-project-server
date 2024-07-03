import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json()); // Middleware to parse JSON bodies

// Create a new patient treatment
router.post('/patient/treatment', async (req, res) => {
  try {
    const { patientId, userId, doctorId, medication, therapies, treatment } = req.body;

    const patientTreatment = await prisma.patientTreatment.create({
      data: {
        patientId: parseInt(patientId, 10),
        doctorId: parseInt(doctorId, 10),
        userId : parseInt(userId, 10),
        medication,
        therapies,
        treatment,
      },
    });

    res.status(201).json({message : "Successfully submitted"});
  } catch (error) {
    console.error('Error creating patient treatment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




export default router;
