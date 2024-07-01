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

    // Check in User collection
    let user = await prisma.user.findUnique({
      where: { email: email },
      include: { appointments: true }, // Include related appointments if needed
    });

    if (user) {
      response = { type: 'user', details: user };
    }

    // If not found in User, check in Doctor collection
    if (!response) {
      let doctor = await prisma.doctor.findUnique({
        where: { email: email },
        include: { patientDetails: true }, // Include related patient details if needed
      });

      if (doctor) {
        response = { type: 'doctor', details: doctor };
      }
    }

    // If not found in Doctor, check in Admin collection
    if (!response) {
      let admin = await prisma.admin.findUnique({
        where: { email: email },
      });

      if (admin) {
        response = { type: 'admin', details: admin };
      }
    }

    // If user not found in any collection
    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
