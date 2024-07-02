import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route to get a doctor by ID with all details including patient details
router.get('/doctorWithPatient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id, 10) }, // Use string type for MongoDB ObjectId
      include: {
        patientDetails: true, // Include related patient details
      },
    });

    // Debugging log
    //console.log('Fetched doctor:', JSON.stringify(doctor, null, 2));

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorDetail = {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      email: doctor.email,
      specialization: doctor.specialization,
      address1: doctor.address1,
      address2: doctor.address2,
      city: doctor.city,
      state: doctor.state,
      zipCode: doctor.zipCode,
      ugDegree: doctor.ugDegree,
      pgDegree: doctor.pgDegree,
      instituteNamePg: doctor.instituteNamePg,
      instituteNameUg: doctor.instituteNameUg,
      otherQualification: doctor.otherQualification,
      gender: doctor.gender,
      fees: doctor.fees,
      availability: doctor.availability,
      password: doctor.password,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      experience: doctor.experience,
    };
    
    const patientDetail : any = doctor.patientDetails;

    res.status(200).json({ doctorDetail, patientDetail });
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
