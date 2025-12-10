"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export function HeaderAuth() {
  return (
    <div className="flex items-center gap-3">
      {/* When user is signed out */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm text-[var(--accent,#38bdf8)] hover:opacity-80">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-full border border-[var(--accent,#38bdf8)] px-3 py-1 text-xs font-medium text-[var(--accent,#38bdf8)] hover:bg-[var(--accent,#38bdf8)]/10">
            Sign up free
          </button>
        </SignUpButton>
      </SignedOut>

      {/* When user is signed in */}
      <SignedIn>
        <Link
          href="/account"
          className="text-sm text-[var(--accent,#38bdf8)] hover:opacity-80"
        >
          Account
        </Link>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
    </div>
  );
}
