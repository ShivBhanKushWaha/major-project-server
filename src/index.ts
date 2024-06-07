import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import userSignup from './auth/userSignup';
import userLogin from './auth/userLogin';
import registerDoctor from './auth/registerDoctor';
import signinDoctor from './auth/signinDoctor';
import admin from './auth/admin';
import doctorList from './doctorList/allDoctorList';
import doctorById from './doctorList/doctorById';
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

app.use('/', doctorById);
app.use('/', doctorList);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
