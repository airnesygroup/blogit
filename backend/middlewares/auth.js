import { withAuth } from "@clerk/clerk-sdk-node";

// Middleware to attach auth data to the request
export const authMiddleware = (req, res, next) => {
  withAuth(req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Authentication error", error: err.message });
    }
    next();
  });
};
