import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api/stripe/webhook|sign-in|sign-up|favicon.ico).*)",
  ],
};
