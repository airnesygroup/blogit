import express from "express";
import connectDB from "../lib/connectDB.js";
import userRouter from "../routes/user.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment.route.js";
import webhookRouter from "../routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Initialize Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Use Clerk middleware
const app = express();
app.use(clerkMiddleware({ clerkClient }));

app.use(cors(process.env.CLIENT_URL));
app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://blogifiyclient.vercel.app",
        "http://localhost:5173",
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/test", (req, res) => {
  res.status(200).send("it works!");
});

app.get("/auth-state", (req, res) => {
  const authState = req.auth;
  res.json(authState);
});

app.get("/protect", (req, res) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json("not authenticated");
  }
  res.status(200).json("content");
});

app.get("/protect2", requireAuth(), (req, res) => {
  res.status(200).json("content");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running!");
});
