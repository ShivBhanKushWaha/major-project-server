import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

const resetBookedSlots = async () => {
  try {
    // Get all doctors
    const doctors = await prisma.doctor.findMany();

    // Loop through each doctor to reset booked slots to unbooked slots
    for (const doctor of doctors) {
      await prisma.doctor.update({
        where: { id: doctor.id },
        data: { bookedSlote: [], unBookedSlote: doctor.availability },
      });
    }

    console.log('Booked slots reset successfully');
  } catch (error) {
    console.error('Error resetting booked slots:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Schedule the task to run daily at midnight (0:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled task: Resetting booked slots');
  await resetBookedSlots();
});

export default resetBookedSlots;
