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
const jwt = require('jsonwebtoken');

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


function verifyToken(req, res, next) {
    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Replace 'your-secret-key' with your actual secret key or use environment variables
    jwt.verify(token, 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAumGKYOj+Nep6nkzCT6t6G99gzKzDBHaHp8DZdVYno6pu0AAyMDB8WTO75+GmQ2POn3KYNXRVyFmTXMjIoC6zrJ3kX238hEbz4G6yO8ubdz+1NkiSOTWrT5r1b3cUKDIR3MF3rfiGOq/NHOn+O6916U/ASPHpkuzq7kR5xych8E52t7sGijkMyJMvbxaIAobLGeSVZr/Ny6V1+FrH6psWz3T9G6zxiHNHY7GB+tfLOtQdvnXWEHeHKK2d91aOGyqJPgeUCgQ7UJnXuYxNtsMBCcINq0SCIKna7BlxUQcNE25Fe4yeSZzZtMq1nt1i4Rq2gDJO4Ea3wJ7+Cjywzus61QIDAQABy', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Add decoded user info to request object for later use in other routes
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
}


// Test route
app.get("/test", (req, res) => {
  res.status(200).send("it works!");
});

// Auth state route
app.get("/auth-state", (req, res) => {
  const authState = req.auth;
  res.json(authState);
});

// Protected route without requireAuth middleware
app.get("/protect", (req, res) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json("not authenticated");
  }
  res.status(200).json("content");
});

// Protected route with requireAuth middleware
app.get("/protect2", requireAuth(), (req, res) => {
  res.status(200).json("content");
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
const mongoURI = 'mongodb+srv://airnesyinfo:airnesyinfo@cluster0.54a22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=blog';

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
