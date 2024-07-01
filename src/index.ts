import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

import userSignup from './auth/userSignup';
import userLogin from './auth/userLogin';
import registerDoctor from './auth/registerDoctor';
import signinDoctor from './auth/signinDoctor';
import admin from './auth/admin';
import doctorList from './doctorList/allDoctorList';
import doctorById from './doctorList/doctorById';
import patients from './doctor/patients';
import Drashboad from './Dashboard'
import UserData from './user/index';
import PatientDetails from './patientDetail/index'
import doctorWithPatients from './doctorList/doctorWithPatients';
import patientWithDoctorDetails from './patientDetail/patientWithDr';
import userDetail from './user/userDetails';
import patientById from './patientDetail/patientById'
// async function createAdmin() {

//   const admin = {
//     email: 'admin',
//     password: '123',
//     name : 'Admin',
//   };

//   const newAdmin = await prisma.admin.create({
//     data: {
//       name: admin.name,
//       email: admin.email,
//       password: admin.password,
//     },
//   });
// }

// createAdmin();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.get("/", (req, res) => {
  return res.json({ message: "Hello from server" });
});

app.use('/auth', userSignup);
app.use('/auth', userLogin);

app.use('/auth', registerDoctor);
app.use('/auth', signinDoctor);
app.use('/auth', admin);

// it only returns doctor information not patients
app.use('/', doctorById);

// return doctor list with all appointment counts with that doctor
app.use('/', doctorList);

// return the doctor with thier all appointments information
app.use('/', patients);

app.use('/', Drashboad);

// userDate
app.use('/', UserData);

// Fill Patients Data
app.use('/', PatientDetails);

// return doctor information with thier Id and all Patients belonging to that doctor
app.use('/', doctorWithPatients);

// return PatientDetails With thier Doctor Details
app.use('/', patientWithDoctorDetails);


app.use('/', userDetail);


app.use('/', patientById);




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
