import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";
import { requireAuth } from "@clerk/express"; // Import Clerk's requireAuth

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", (req, res, next) => {
  console.log("Auth State:", req.auth);
  next();
}, requireAuth(), createPost);router.delete("/:id", deletePost);
router.patch("/feature", featurePost);
export default router 