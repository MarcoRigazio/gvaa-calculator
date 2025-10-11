import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Skip ALL /api/* (keep API public) and static assets; allow auth pages.
export const config = {
  matcher: ["/((?!_next|.*\\..*|api/|sign-in|sign-up|favicon.ico).*)"],
};
