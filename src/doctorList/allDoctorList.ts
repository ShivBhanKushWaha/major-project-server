import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route to get a list of doctors with minimal needed data including experience
router.get('/doctorList', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        city: true,
        state: true,
        fees: true,
        experience: true, // Include experience in the selected fields
      }
    });

    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctor list:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
