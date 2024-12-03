import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClerkClient } from '@clerk/backend';
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import cors from "cors";
import { createPost } from "../controllers/post.controller.js";
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'; // Import Clerk middleware
import * as Clerk from '@clerk/clerk-sdk-node'; // Import Clerk SDK

dotenv.config();

const app = express();

// Initialize Clerk Client only once
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY
});

// Use Clerk middleware for authentication
app.use(clerkMiddleware({ clerkClient }));

// Route to test Clerk authentication
app.get('/protected', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await clerkClient.users.getUser({ token });
    console.log('User:', user);
    res.send('This is a protected route');
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
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
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Use routers
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/webhook", webhookRouter);

// Endpoint to create posts (for example)
app.post("/posts", createPost);

// Error handling for unauthorized requests
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

// MongoDB connection
const mongoURI = "mongodb+srv://airnesyinfo:airnesyinfo@cluster0.54a22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=blog";
if (!mongoURI) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
