import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log("Error: Webhook secret is missing.");
    return res.status(400).json({
      message: "Webhook secret needed!",
    });
  }

  console.log("Webhook secret found, proceeding to extract payload and headers.");

  const payload = req.body;
  const headers = req.headers;

  console.log("Payload and headers received:", { payload, headers });

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  // Convert payload to string before verifying
  const payloadString = JSON.stringify(payload);

  try {
    console.log("Verifying webhook payload...");
    evt = wh.verify(payloadString, headers); // Pass the stringified payload
    console.log("Webhook verification successful:", evt);
  } catch (err) {
    console.log("Error during webhook verification:", err);
    return res.status(400).json({
      message: "Webhook verification failed!",
      error: err.message,
    });
  }

  // Ensure evt is valid
  if (!evt || !evt.type) {
    console.log("Error: Invalid event data received.", evt);
    return res.status(400).json({
      message: "Invalid event data",
    });
  }

  console.log("Event type received:", evt.type);

  if (evt.type === "user.created") {
    console.log("Handling 'user.created' event.");
    const newUser = new User({
      clerkUserId: evt.data.id,
      username: evt.data.username || evt.data.email_addresses[0].email_address,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_img_url,
    });

    console.log("Saving new user:", newUser);
    await newUser.save();
    console.log("User saved successfully.");
  }

  if (evt.type === "user.deleted") {
    console.log("Handling 'user.deleted' event.");
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    console.log("Deleted user:", deletedUser);

    await Post.deleteMany({ user: deletedUser._id });
    await Comment.deleteMany({ user: deletedUser._id });

    console.log("Related posts and comments deleted.");
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};