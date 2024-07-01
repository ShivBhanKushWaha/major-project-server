import express from 'express';
import authenticate from './../middleware/authenticate'; // Adjust the path as needed
import { PrismaClient } from '@prisma/client';

const getRouter = express.Router();
const prisma = new PrismaClient();

getRouter.get('/userDetails', authenticate, async (req: any, res: any) => {
  const email = req.email; // Extract email from the request

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { appointments: true }, // Include related appointments if needed
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default getRouter;
