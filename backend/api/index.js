import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ClerkExpressWithAuth, requireAuth } from "@clerk/express"; // Import Clerk
import cors from "cors";
import connectDB from "../lib/connectDB.js";
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";

// Load environment variables from .env file
dotenv.config(); // Ensure .env is loaded at the top

const app = express();

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://blogifiyclient.vercel.app", // Production client URL
        "http://localhost:5173", // Local development
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Initialize Clerk with Secret Key
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
app.use(ClerkExpressWithAuth({ apiKey: clerkSecretKey }));

// API routes with Clerk protection
app.use("/users", requireAuth(), userRouter);
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

// MongoDB connection
const mongoURI = process.env.DATABASE_URL || "mongodb://localhost:27017/blog";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
