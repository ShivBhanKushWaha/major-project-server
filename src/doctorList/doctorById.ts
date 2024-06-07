import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route to get a doctor by ID with all details
router.get('/doctor/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure ID is an integer
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
