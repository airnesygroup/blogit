import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';

// Importing route files
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import webhookRouter from './routes/webhook.route.js';
import { createPost } from './controllers/post.controller.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Clerk Client with the Clerk secret and publishable keys
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Use Clerk middleware for authentication
app.use(clerkMiddleware({ clerkClient }));

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS with allowed origins
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://blogifiyclient.vercel.app',
        'http://localhost:5173', // React app running locally for development
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

// API routes
app.use('/users', userRouter); // User routes
app.use('/posts', postRouter); // Post routes
app.use('/comments', commentRouter); // Comment routes
app.use('/webhook', webhookRouter); // Webhook routes

// Post creation route
app.post('/posts', createPost);

// Global error handler for unauthenticated users
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_db_name';
if (!mongoURI) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

// Connect to MongoDB
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
  console.log(`Server is running on http://localhost:${port}`);
});
