import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


router.post('/userData', async (req, res) => {
  try {
    const { id, email } = req.body;

    // Validate input
    if (!id && !email) {
      return res.status(400).json({ error: 'ID or email must be provided' });
    }

    let user;
    if (id) {
      user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
        include: { appointments: true }, // Include related appointments if needed
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        include: { appointments: true }, // Include related appointments if needed
      });
    }

    // If user not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user details
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
