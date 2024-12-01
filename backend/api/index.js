import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; // Ensure dotenv is imported first
import connectDB from "../lib/connectDB.js";
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config(); // Ensure .env is loaded at the top

// Server setup
const app = express();

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://blogifiyclient.vercel.app', // Production client URL
      'http://localhost:5173',  // Local development
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// API routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/webhook", webhookRouter); // Make sure this route is properly set up

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// Ensure DATABASE_URL is properly loaded from .env
const mongoURI =  "mongodb+srv://airnesyinfo:airnesyinfo@cluster0.54a22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=blog" ;
if (!mongoURI) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1); // Exit if no DB URL is available
}

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
