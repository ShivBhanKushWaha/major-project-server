import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the admin by email
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    // Check if admin exists and if the password is correct
    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = generateToken(admin.email);

    // Return the admin email and token
    return res.json({ admin: admin.email, token: token });
  } catch (error) {
    console.error('Error during admin signin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
