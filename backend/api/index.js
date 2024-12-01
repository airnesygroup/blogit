import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import connectDB from "../lib/connectDB.js";
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import cors from "cors";
import { authenticate } from './middleware/authenticate.js'; // Import the authentication middleware

dotenv.config(); // Load environment variables

const app = express();

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://blogifiyclient.vercel.app', 
      'http://localhost:5173', 
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Apply authentication middleware for all routes that require authentication
app.use(authenticate); // This should be placed before the routes that require authentication

// API routes
app.use("/users", userRouter);
app.use("/posts", postRouter); // The createPost route requires authentication, so authenticate middleware will run first
app.use("/comments", commentRouter);
app.use("/webhook", webhookRouter); 

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// MongoDB connection
const mongoURI = "mongodb+srv://your_mongo_uri_here";  // Use your actual MongoDB URI
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
  console.log(`Server is running on port ${port}`);
});
