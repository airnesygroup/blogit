import { clerkMiddleware, requireAuth } from '@clerk/express';
import express from 'express';

const app = express();

// Apply centralized middleware
app.use(clerkMiddleware());

// Apply middleware to a specific route
app.get('/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route');
});