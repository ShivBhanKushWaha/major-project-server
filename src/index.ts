import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import dbConnect from './database/dbConnect';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL || 'your mongodb url'

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

dbConnect(DB_URL)

// Routes
app.get("/", (req, res) => {
  return res.json({ message: "Hello from server" });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
