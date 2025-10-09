// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/** Request payload shape */
type CheckoutRequest = {
  // Use one of these patterns:
  // 1) Single price
  priceId?: string;            // e.g., "price_123"
  quantity?: number;           // default 1

  // 2) Multiple items
  lineItems?: { price: string; quantity?: number }[];

  // Mode: "payment" (one-time) or "subscription"
  mode?: "payment" | "subscription";

  // Optional customer data
  customerEmail?: string;

  // Optional metadata to attach to the Checkout Session
  metadata?: Record<string, string>;
};

function baseUrlFromEnv(): string {
  // Prefer the public app URL, else derive from Vercel env, else localhost
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL; // e.g. "calc-project.vercel.app"
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

function badRequest(message: string) {
  return new NextResponse(message, { status: 400 });
}

function serverError(message: string) {
  return new NextResponse(message, { status: 500 });
}

export async function POST(req: NextRequest) {
  // Lazy import so Turbopack doesn’t evaluate at build
  const { default: Stripe } = await import("stripe");

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return serverError("Missing STRIPE_SECRET_KEY");

  const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" });

  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Normalize inputs
  const mode: "payment" | "subscription" = body.mode ?? "payment";

  // Build Stripe line items
  const items =
    body.lineItems && body.lineItems.length > 0
      ? body.lineItems.map((li) => ({
          price: li.price,
          quantity: li.quantity ?? 1,
        }))
      : body.priceId
      ? [{ price: body.priceId, quantity: body.quantity ?? 1 }]
      : null;

  if (!items) {
    return badRequest(
      "Provide either { priceId [, quantity] } or { lineItems: [{ price, quantity? }, ...] }",
    );
  }

  const successCancelBase = baseUrlFromEnv();
  const successUrl = `${successCancelBase}/?checkout=success`;
  const cancelUrl = `${successCancelBase}/?checkout=cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: items,
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: body.customerEmail,
      metadata: body.metadata,
      // If you sell subscriptions and want to collect address, enable tax/shipping here
      // automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: unknown }).message)
        : "Stripe error";
    return serverError(msg);
  }
}
