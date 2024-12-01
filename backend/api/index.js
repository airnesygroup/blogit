import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import connectDB from "../lib/connectDB.js";
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node"; // Import Clerk SDK for Express

dotenv.config();

// Server setup
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

// Use Clerk authentication middleware
app.use(ClerkExpressWithAuth()); // This populates req.auth with Clerk's user data

// API routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
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

const mongoURI = "mongodb+srv://airnesyinfo:airnesyinfo@cluster0.54a22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=blog";
if (!mongoURI) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1); 
}

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1); 
  });

// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
