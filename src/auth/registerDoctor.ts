import express from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "./../middleware/jwt";

const router = express.Router();
const prisma = new PrismaClient();


// Function to convert 12-hour format time to minutes
const timeToMinutes = (time: string): number => {
  const [timePart, meridiem] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Function to convert minutes to 12-hour format time string
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours < 12 || hours === 24 ? "AM" : "PM";
  const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${adjustedHours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

// Function to create 30-minute slots
const generate30MinSlots = (start: string, end: string): string[] => {
  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);
  const slots = [];

  for (let time = startTime; time < endTime; time += 30) {
    const slotStart = minutesToTime(time);
    const slotEnd = minutesToTime(time + 30);
    slots.push(`${slotStart} - ${slotEnd}`);
  }

  return slots;
};

// Main function to generate all unbooked slots
const generateUnbookedSlots = (availableSlots: string[]): string[] => {
  let unbookedSlots: string[] = [];

  availableSlots.forEach((slot) => {
    const [start, end] = slot.split(" - ");
    unbookedSlots = [...unbookedSlots, ...generate30MinSlots(start, end)];
  });

  return unbookedSlots;
};

router.post("/registerDoctor", async (req, res) => {
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
    experience,
  } = req.body;

  try {
    // Check if doctor already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: email },
    });

    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor already exists with this email" });
    }

    // Generate unbooked slots
    const unBookedSlote: string[] = generateUnbookedSlots(availabilityRanges);
    console.log(unBookedSlote);
    const bookedSlote: any = []; // Initially empty

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
        availability: availabilityRanges, // Store as array of time slots
        bookedSlote:[],
        unBookedSlote:unBookedSlote,
        password,
        experience,
      },
    });

    // Generate JWT token
    const token = generateToken(newDoctor.id);

    res.status(201).json({ doctor: newDoctor, token });
  } catch (error) {
    console.error("Error during doctor registration:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
