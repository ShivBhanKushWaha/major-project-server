import express from 'express';
import authenticate from './../middleware/authenticate'; // Adjust the path as needed
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/userDetails', authenticate, async (req: any, res: any) => {
  const email = req.email;
  const id = email.email;
  let response: { type: 'user' | 'doctor' | 'admin'; details: any; } | null = null;

  const isNumericId = /^\d+$/.test(id); // Check if the id is a numeric string

  try {
    if (isNumericId) {
      const numericId = parseInt(id, 10);

      const [user, doctor, admin] = await Promise.all([
        prisma.user.findUnique({
          where: { id: numericId },
          include: {
            appointments: true,
            patientTreatments: true,
          },
        }),
        prisma.doctor.findUnique({
          where: { id: numericId },
          include: {
            patientDetails: {
              include: {
                patientTreatments: true,
              },
            },
            appointments: true,
            patientTreatments: true,
          },
        }),
        prisma.admin.findUnique({
          where: { id: numericId },
        }),
      ]);

      if (user) response = { type: 'user', details: user };
      else if (doctor) response = { type: 'doctor', details: doctor };
      else if (admin) response = { type: 'admin', details: admin };
    } else {
      const [user, doctor, admin] = await Promise.all([
        prisma.user.findUnique({
          where: { email: id },
          include: {
            appointments: true,
            patientTreatments: true,
          },
        }),
        prisma.doctor.findUnique({
          where: { email: id },
          include: {
            patientDetails: {
              include: {
                patientTreatments: true,
              },
            },
            appointments: true,
            patientTreatments: true,
          },
        }),
        prisma.admin.findUnique({
          where: { email: id },
        }),
      ]);

      if (user) response = { type: 'user', details: user };
      else if (doctor) response = { type: 'doctor', details: doctor };
      else if (admin) response = { type: 'admin', details: admin };
    }

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after query execution
  }
});

export default router;
