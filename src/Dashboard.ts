import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req, res) => {
  try {
    const totalDoctors = await prisma.doctor.count();
    const totalPatients = await prisma.user.count();
    const totalAppointments = await prisma.appointment.count();

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
