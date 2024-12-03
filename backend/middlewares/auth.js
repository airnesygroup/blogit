import { clerkMiddleware, requireAuth } from '@clerk/express';
import express from 'express';


const app = express();

// Apply Clerk middleware globally
app.use(clerkMiddleware());

// Example protected route
app.get('/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route');
});
