import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route to get all patient details with their doctor's name
router.get('/patients', async (req, res) => {
  try {
    const patients = await prisma.patientDetails.findMany({
      include: {
        doctor: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
