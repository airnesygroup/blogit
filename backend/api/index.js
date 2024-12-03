import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createClerkClient } from '@clerk/backend'
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import cors from "cors";
import { createPost } from "../controllers/post.controller.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

app.use(clerkMiddleware({ clerkClient }))





app.use(express.json());

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

// Add Clerk middleware
app.use(clerkMiddleware());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/webhook", webhookRouter);

app.post("/posts", createPost);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!')
});

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});