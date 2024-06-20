import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticate from './../middleware/authenticate';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/doctor/patients/', authenticate, async (req, res) => {
  // @ts-ignore
  const doctorEmail = req.email; // Assuming you have the doctor's email in req.email after authentication
  console.log(doctorEmail);

  try {
    // Fetch the doctor's details
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
      select: { id: true, name: true }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Fetch appointments with patient details
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: { user: true } // Include the user (patient) details
    });

    // Construct the response
    const response = {
      doctorName: doctor.name,
      appointments: appointments
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
