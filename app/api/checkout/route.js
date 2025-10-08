// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function createSession(req: NextRequest) {
  // Require a signed-in user
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Accept either ?price=lookup_key or JSON { lookup }
  let lookup = "";
  const url = new URL(req.url);
  lookup = url.searchParams.get("price") || "";

  if (!lookup) {
    const body = await req.json().catch(() => ({} as any));
    lookup = (body.lookup as string) || "";
  }
  if (!lookup) {
    return NextResponse.json({ error: "Missing price lookup_key" }, { status: 400 });
  }

  // Find Stripe Price by lookup_key (e.g., calc_monthly, suite_annual)
  const prices = await stripe.prices.search({
    query: `active:'true' AND lookup_key:'${lookup}'`,
  });
  const price = prices.data[0];
  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 400 });
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: price.id, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    client_reference_id: userId, // used by webhook to map back to Clerk
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return createSession(req);
}

// ✅ New: allow simple browser testing with GET
export async function GET(req: NextRequest) {
  return createSession(req);
}
