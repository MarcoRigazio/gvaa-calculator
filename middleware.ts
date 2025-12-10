/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes — everything else requires auth
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/checkout",
  "/api/checkout_v3",
  "/icon.svg",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Protect all routes except static files and Next internals
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
