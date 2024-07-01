// patientDetailsRouter.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
//import authenticate from './../middleware/authenticate'; // Adjust the path as needed

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to parse JSON bodies
router.use(express.json());

// Route to get patient details by ID
router.get('/patient/details/:id', async (req, res) => {
  const patientId = parseInt(req.params.id, 10);

  try {
    const patientDetails = await prisma.patientDetails.findUnique({
      where: { id: patientId },
      include: { doctor: true },
    });

    if (!patientDetails) {
      return res.status(404).json({ message: 'Patient details not found' });
    }

    res.status(200).json(patientDetails);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
