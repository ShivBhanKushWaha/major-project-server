import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

import userSignup from './auth/userSignup';
import userLogin from './auth/userLogin';
import registerDoctor from './auth/registerDoctor';
import signinDoctor from './auth/signinDoctor';


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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
