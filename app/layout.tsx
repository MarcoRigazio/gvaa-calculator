// app/layout.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"; // ✅ added
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyVOBiz Calculator",
  description: "GVAA-aware quoting with Stripe billing.",
  icons: { icon: "/icon.svg" },
};

export const viewport = {
  themeColor: "#0EA5E9",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Global Header */}
          <header className="border-b border-[var(--line)] bg-[var(--bg)]">
            <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icon.svg" alt="MyVOBiz" width={28} height={28} priority />
                <span className="font-semibold text-[var(--ink)]">MyVOBiz</span>
              </div>
              <nav className="text-sm">
                <a href="/account" className="text-[var(--accent)] hover:opacity-80">
                  Manage billing
                </a>
              </nav>
            </div>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
