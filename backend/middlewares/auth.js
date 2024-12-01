




import { withAuth } from "@clerk/express";

export const authMiddleware = (req, res, next) => {
  withAuth(req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed", error: err.message });
    }
    next();
  });
};
