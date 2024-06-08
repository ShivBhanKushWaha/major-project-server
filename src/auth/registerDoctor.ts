import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/registerDoctor', async (req, res) => {
  const {
    name,
    phone,
    email,
    specialization,
    address1,
    address2,
    city,
    state,
    zipCode,
    ugDegree,
    pgDegree,
    instituteName,
    otherQualification,
    gender,
    fees,
    availability,
    timeSlot,
    password,
    experience
  } = req.body;


  try {
    // Check if doctor already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: email },
    });

    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    // Create new doctor
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        phone,
        email,
        specialization,
        address1,
        address2,
        city,
        state,
        zipCode,
        ugDegree,
        pgDegree,
        instituteName,
        otherQualification,
        gender,
        fees: parseFloat(fees),
        availability, // Ensure this is a string or use JSON.stringify(availability)
        timeSlot,     // Ensure this is a string or use JSON.stringify(timeSlot)
        password,
        experience
      },
    });

    // Generate JWT token
    const token = generateToken(newDoctor.id);

    res.status(201).json({ doctor: newDoctor, token });
  } catch (error) {
    console.error('Error during doctor registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
