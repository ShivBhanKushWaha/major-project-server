import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticate from './../middleware/authenticate'
const router = express.Router();
const prisma = new PrismaClient();

router.get('/doctor/patients/', authenticate, async (req, res) => {
  // @ts-ignore
    const doctorId = req.email; // Assuming you have the doctor ID in req.user.id after authentication
    console.log(doctorId);
//   try {
//     const appointments = await prisma.appointment.findMany({
//       where: {
//         doctorId: doctorId,
//       },
//       include: {
//         user: true, // Include the user (patient) details
//       },
//     });

//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Error fetching doctor appointments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     await prisma.$disconnect();
//   }
    return res.json({ms : 'internal'});
});

export default router;
