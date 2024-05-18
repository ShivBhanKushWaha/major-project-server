import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/userSignup', async (req, res) => {
  const { name, mobileNumber, password, email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        mobileNumber,
        password
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.email);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
