import { requireAuth } from "@clerk/express";

export const authMiddleware = (req, res, next) => {
  requireAuth()(req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Not authenticated", error: err.message });
    }
    next();
  });
};
