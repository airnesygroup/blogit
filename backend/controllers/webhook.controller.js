import express from 'express';
import { Webhook } from 'svix';
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const app = express();

// Use express.raw to capture the raw request body as Buffer
app.use(express.raw({ type: 'application/json' }));

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Webhook secret is missing");
    return res.status(500).json({
      message: "Webhook secret needed!",
    });
  }

  const payload = req.body; // This should be in raw format (Buffer)
  const headers = req.headers;

  console.log("Raw Payload received:", payload);
  console.log("Headers received:", headers);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    // Ensure raw body is passed to verify
    evt = wh.verify(payload, headers);
    console.log("Webhook verified successfully:", evt);
  } catch (err) {
    console.error("Webhook verification failed", err);
    return res.status(400).json({
      message: "Webhook verification failed!",
    });
  }

  if (!evt) {
    console.error("No event data received");
    return res.status(400).json({
      message: "Event data is missing",
    });
  }

  if (evt.type === "user.created") {
    try {
      console.log("Processing user.created event");
      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username || evt.data.email_addresses[0].email_address,
        email: evt.data.email_addresses[0].email_address,
        img: evt.data.profile_img_url,
      });

      await newUser.save();
      console.log("New user created successfully");
    } catch (err) {
      console.error("Error creating new user", err);
      return res.status(500).json({
        message: "Error creating new user",
      });
    }
  }

  if (evt.type === "user.deleted") {
    try {
      console.log("Processing user.deleted event");
      const deletedUser = await User.findOneAndDelete({
        clerkUserId: evt.data.id,
      });

      if (deletedUser) {
        await Post.deleteMany({ user: deletedUser._id });
        await Comment.deleteMany({ user: deletedUser._id });
        console.log("User and associated data deleted successfully");
      } else {
        console.log("User not found for deletion");
      }
    } catch (err) {
      console.error("Error handling user.deleted event", err);
      return res.status(500).json({
        message: "Error handling user.deleted event",
      });
    }
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};
