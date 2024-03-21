import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function createUser() {
  await prisma.user.create({

    data: {

      name: 'Alice',

      email: 'alice@prisma.io',

      posts: {

        create: { title: 'Hello World' },

      },

      profile: {

        create: { bio: 'I like turtles' },

      },

    },

  })
}


createUser();


async function getUser() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
getUser()
.then(async () => {
  await prisma.$disconnect();
})
.catch(async () => {
  await prisma.$disconnect();
})






// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.get("/", (req, res) => {
  return res.json({ message: "Hello from server" });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
