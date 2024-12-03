import { clerkMiddleware } from '@clerk/nextjs/server'

// Add publicRoutes if needed
export default clerkMiddleware({
  publicRoutes: ["/"]  
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};