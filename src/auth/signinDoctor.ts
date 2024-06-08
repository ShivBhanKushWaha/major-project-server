import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signinDoctor', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the doctor by email
    const doctor = await prisma.doctor.findUnique({
      where: { email: email },
    });

    // Check if doctor exists
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = (password === doctor.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(doctor.id);

    res.status(200).json({ doctor, token });
  } catch (error) {
    console.error('Error during doctor signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
