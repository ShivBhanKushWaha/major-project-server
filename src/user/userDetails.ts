import express from 'express';
import authenticate from './../middleware/authenticate'; // Adjust the path as needed
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/userDetails', authenticate, async (req: any, res: any) => {
  const email = req.email;

  try {
    // Define custom response structure
    let response: {
      type: 'user' | 'doctor' | 'admin';
      details: any;
    } | null = null;

    // Parallel promises to search in all collections
    const [user, doctor, admin] = await Promise.all([
      prisma.user.findUnique({
        where: { email: email },
        include: {
          appointments: true,
        }, // Include related appointments if needed
      }),
      prisma.doctor.findUnique({
        where: { email: email },
        include: {
          patientDetails: {
            include: {
              patientTreatments: true,
            },
          },
          appointments: true,
        }, // Include related patient details and appointments if found in Doctor table
      }),
      prisma.admin.findUnique({
        where: { email: email },
      }),
    ]);

    // Check if user was found in User collection
    if (user) {
      response = { type: 'user', details: user };
    }

    // If not found in User, check if found in Doctor collection
    else if (doctor) {
      response = { type: 'doctor', details: doctor };
    }

    // If not found in Doctor, check if found in Admin collection
    else if (admin) {
      response = { type: 'admin', details: admin };
    }

    // If user not found in any collection
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
