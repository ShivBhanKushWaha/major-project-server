// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// @ts-ignore
const generateTimeSlots = (startTime, endTime) => {
  // @ts-ignore
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
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

async function main() {
  // Function to delete all existing data
  async function deleteAllData() {
    try {
      // Delete all data from related tables first to avoid foreign key constraints
      await prisma.appointment.deleteMany({});
      await prisma.patientDetails.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.admin.deleteMany({});
      await prisma.doctor.deleteMany({});
  
      console.log('All data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  // Delete all existing data before creating new data
  await deleteAllData();

  // Sample Indian names and degrees
  const doctorNames = [
    "Dr. Asha Patel", "Dr. Vikram Singh", "Dr. Sunita Sharma", 
    "Dr. Anil Kumar", "Dr. Priya Mehta", "Dr. Rajesh Gupta",
    "Dr. Neha Verma", "Dr. Amit Joshi", "Dr. Ritu Shah", "Dr. Suresh Reddy"
  ];
  const userNames = [
    "Rahul Desai", "Sneha Rao", "Arjun Nair", "Pooja Choudhary", 
    "Ravi Malhotra", "Nisha Yadav", "Vikash Pandey", "Kiran Pawar", 
    "Sachin Goel", "Anjali Iyer"
  ];
  const degrees = [
    "MBBS", "MD", "BDS", "MDS", "BAMS", "BHMS", "BPT", "MPT", 
    "MS (General Surgery)", "MD (Pediatrics)"
  ];
  const institutes = [
    "AIIMS", "Kasturba Medical College", "JIPMER", "Christian Medical College",
    "St. John's Medical College", "Madras Medical College", 
    "Grant Medical College", "Seth GS Medical College", "Maulana Azad Medical College",
    "Lady Hardinge Medical College"
  ];

  // Create 10 doctors
  const doctors = await Promise.all(doctorNames.map(async (name, i) => {
    const startTime = new Date('2024-07-01T10:00:00');
    const endTime = new Date('2024-07-01T13:00:00');
    const availability = generateTimeSlots(startTime, endTime);
    const unBookedSlote = [...availability];
    const bookedSlote = []; // Initially empty

    return prisma.doctor.create({
      data: {
        name,
        phone: `123456789${i + 1}`,
        email: `doctor${i + 1}@example.com`,
        specialization: `Specialization ${i + 1}`,
        address1: `Address 1 - ${i + 1}`,
        address2: `Address 2 - ${i + 1}`,
        city: `City ${i + 1}`,
        state: `State ${i + 1}`,
        zipCode: `12345${i}`,
        ugDegree: degrees[Math.floor(Math.random() * degrees.length)],
        pgDegree: degrees[Math.floor(Math.random() * degrees.length)],
        instituteNameUg: institutes[Math.floor(Math.random() * institutes.length)],
        instituteNamePg: institutes[Math.floor(Math.random() * institutes.length)],
        otherQualification: `Qualification ${i + 1}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        fees: 100 + i * 10,
        availability,
        bookedSlote,
        unBookedSlote,
        password: `password${i + 1}`,
        experience: `5 + ${i + 1}`,
      }
    });
  }));

  console.log('Doctors created:', doctors);

  // Create 10 users
  const users = await Promise.all(userNames.map(async (name, i) => {
    return prisma.user.create({
      data: {
        name,
        email: `user${i + 1}@example.com`,
        mobileNumber: `987654321${i}`,
        password: `userpassword${i + 1}`
      }
    });
  }));

  console.log('Users created:', users);

  // Create 10 patient details linked to doctors
  const patientDetails = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.patientDetails.create({
      data: {
        familyMember: `Family Member ${i + 1}`,
        age: 30 + i,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        contactNumber: `1122334455${i}`,
        historyOfMentalIssue: i % 2 === 0 ? 'No' : 'Yes',
        symptoms: `Symptoms ${i + 1}`,
        diagnosis: `Diagnosis ${i + 1}`,
        treatment: `Treatment ${i + 1}`,
        whichFamilyMember: `Family Member ${i + 1}`,
        symptomsOfPatient: `Symptoms of Patient ${i + 1}`,
        whenProblemStart: `Problem started ${i + 1} months ago`,
        previousPatientTreatment: i % 2 === 0 ? 'No' : 'Yes',
        freqOfSymptoms: `Frequency ${i + 1}`,
        triggerPoint: `Trigger Point ${i + 1}`,
        capacityOfWork: `Capacity ${i + 1}`,
        sleepProper: i % 2 === 0 ? 'Yes' : 'No',
        timeOfSleep: `${6 + i} hours`,
        eatingProperly: i % 2 === 0 ? 'Yes' : 'No',
        interestedToDoSomething: i % 2 === 0 ? 'Yes' : 'No',
        notInterested: `Not Interested ${i + 1}`,
        selfTime: 'yes',
        notSelfTime: 'no',
        doctorId: doctors[i % doctors.length].id // Link to a doctor
      }
    });
  }));

  console.log('Patient details created:', patientDetails);

  // Create 10 admins
  const admins = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.admin.create({
      data: {
        name: `Admin ${i + 1}`,
        email: `admin${i + 1}@example.com`,
        password: `adminpassword${i + 1}`
      }
    });
  }));

  console.log('Admins created:', admins);

  // Create 10 appointments linked to doctors and users
  const appointments = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.appointment.create({
      data: {
        doctorId: doctors[i % doctors.length].id,
        userId: users[i % users.length].id,
        date: new Date(),
        status: i % 2 === 0 ? 'treated' : 'booked'
      }
    });
  }));

  console.log('Appointments created:', appointments);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
