
import { clerkMiddleware, requireAuth } from '@clerk/express';


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';
import userRouter from '../routes/user.route.js';
import postRouter from '../routes/post.route.js';
import commentRouter from '../routes/comment.route.js';
import webhookRouter from '../routes/webhook.route.js';
import cors from 'cors';
import 'dotenv/config';

dotenv.config();

const app = express();

// Initialize Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Use Clerk middleware
app.use(clerkMiddleware({ clerkClient }));

// Middleware for JSON parsing
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://blogifiyclient.vercel.app',
        'http://localhost:5173',
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.get("/test",(req,res)=>{
  res.status(200).send("it works!")
 })

 app.get("/auth-state", (req, res) => {
  const authState = req.auth;
  res.json(authState);
 });

 app.get("/protect", (req, res) => {
   const {userId} = req.auth;
   if(!userId){
     return res.status(401).json("not authenticated")
   }
  res.status(200).json("content")
 });

 app.get("/protect2", requireAuth(), (req, res) => {
   res.status(200).json("content")
 });

// API Routes
app.use('/users', userRouter);
app.use('/posts', postRouter); // Correctly map the posts route
app.use('/comments', commentRouter);
app.use('/webhook', webhookRouter);

// Debug route to confirm server is running
app.get('/debug', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// MongoDB connection
const mongoURI =
  'mongodb+srv://airnesyinfo:airnesyinfo@cluster0.54a22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=blog';

if (!mongoURI) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

