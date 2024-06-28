import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to generate 30-minute time slots
// @ts-ignore
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const nextTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
    slots.push(`${formatTime(currentTime)} - ${formatTime(nextTime)}`);
    currentTime = nextTime;
  }

  return slots;
};

// @ts-ignore
const formatTime = date => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

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
    instituteNamePg,
    instituteNameUg,
    otherQualification,
    gender,
    fees,
    availabilityStart,
    availabilityEnd,
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

    // Generate availability slots
    const startTime = new Date(availabilityStart);
    const endTime = new Date(availabilityEnd);
    const availabilitySlots = generateTimeSlots(startTime, endTime);
    const unBookedSlote = [...availabilitySlots]; // Initially all slots are unbooked
    const bookedSlote : any = []; // Initially empty

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
        instituteNamePg,
        instituteNameUg,
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
