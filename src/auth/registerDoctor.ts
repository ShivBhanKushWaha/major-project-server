import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './../middleware/jwt';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

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
// @ts-ignore
const generateAvailabilitySlots = availabilityRanges => {
  // @ts-ignore
  let availabilitySlots = [];
  for (const range of availabilityRanges) {
    const [startTime, endTime] = range.split(' - ');
    if (!startTime || !endTime) {
      throw new Error(`Invalid time range: ${range}`);
    }
    const startDateTime = new Date(`1970-01-01T${convertTo24HourFormat(startTime)}`);
    const endDateTime = new Date(`1970-01-01T${convertTo24HourFormat(endTime)}`);
    // @ts-ignore
    availabilitySlots = availabilitySlots.concat(generateTimeSlots(startDateTime, endDateTime));
  }
  return availabilitySlots;
};

// @ts-ignore
const convertTo24HourFormat = time => {
  const [timePart, modifier] = time.split(' ');
  if (!timePart || !modifier) {
    throw new Error(`Invalid time format: ${time}`);
  }
  let [hours, minutes] = timePart.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}:00`;
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
    availabilityRanges,
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
    const availabilitySlots = generateAvailabilitySlots(availabilityRanges);
    console.log(availabilitySlots);
    const unBookedSlote = [...availabilitySlots]; // Initially all slots are unbooked
    const bookedSlote : any= []; // Initially empty

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
        availability: availabilitySlots, // Store as array of time slots
        bookedSlote,
        unBookedSlote,
        password,
        experience
      },
    });

    // Generate JWT token
    const token = generateToken(newDoctor.id);

    res.status(201).json({ doctor: newDoctor, token });
  } catch (error) {
    // @ts-ignore
    console.error('Error during doctor registration:', error.message);
    // @ts-ignore
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
