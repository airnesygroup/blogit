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

  // Convert payload to a string if necessary
  const payloadString = JSON.stringify(payload);

  try {
    console.log("Verifying webhook payload...");

    // Log the signature from the headers and the timestamp
    console.log("Svix Signature: ", headers['svix-signature']);
    console.log("Svix Timestamp: ", headers['svix-timestamp']);
    
    // Verify the signature
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

  // Event handling logic here...

  return res.status(200).json({
    message: "Webhook received",
  });
};
