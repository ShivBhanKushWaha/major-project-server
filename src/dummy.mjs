import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 10 doctors
  const doctors = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.doctor.create({
      data: {
        name: `Doctor ${i + 1}`,
        phone: `123456789${i}`,
        email: `doctor${i + 1}@example.com`,
        specialization: `Specialization ${i + 1}`,
        address1: `Address 1 - ${i + 1}`,
        address2: `Address 2 - ${i + 1}`,
        city: `City ${i + 1}`,
        state: `State ${i + 1}`,
        zipCode: `12345${i}`,
        ugDegree: `UG Degree ${i + 1}`,
        pgDegree: `PG Degree ${i + 1}`,
        instituteNameUg: `Institute ${i + "Ug"}`,
        instituteNamePg: `Institute ${i + "Pg"}`,
        otherQualification: `Qualification ${i + 1}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        fees: 100 + i * 10,
        availability: `Availability ${i + 1}`,
        timeSlot: `Time Slot ${i + 1}`,
        password: `password${i + 1}`,
        experience: 5 + i
      }
    });
  }));

  // Create 10 users
  const users = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        mobileNumber: `987654321${i}`,
        password: `userpassword${i + 1}`
      }
    });
  }));

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
        sleepProper: i % 2 === 0,
        timeOfSleepHourly: 6 + i,
        eatingProperly: i % 2 === 0,
        interestedToDoSomething: i % 2 === 0,
        notInterested: `Not Interested ${i + 1}`,
        qualityTimeForThemselves: i % 2 === 0,
        noThemselves: i % 2 === 0,
        doctorId: doctors[i].id // Link to the doctor
      }
    });
  }));

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

  // Create 10 appointments linked to doctors and users
  const appointments = await Promise.all(Array.from({ length: 10 }).map(async (_, i) => {
    return prisma.appointment.create({
      data: {
        doctorId: doctors[i].id,
        userId: users[i].id,
        date: new Date(),
        status: i % 2 === 0 ? 'treated' : 'booked'
      }
    });
  }));

  console.log('Dummy data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
