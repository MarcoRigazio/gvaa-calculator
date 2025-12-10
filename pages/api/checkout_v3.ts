import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getAuth } from "@clerk/nextjs/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey as string);

type CheckoutBody = {
  priceId?: string;      // Stripe price ID for Pro Monthly / Annual
  success_url?: string;  // optional override
  cancel_url?: string;   // optional override
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ok: true, use: "POST /api/checkout_v3", type: "subscription", v: 1 });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!stripeSecretKey) {
    return res
      .status(500)
      .json({ error: "Stripe secret key is not configured on the server." });
  }

  // Require a logged-in user (middleware should enforce this, but we double-check)
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { priceId, success_url, cancel_url } = (req.body ?? {}) as CheckoutBody;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    // derive absolute URLs if not provided
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host || "localhost:3000";
    const origin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url:
        success_url ??
        `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url ?? `${origin}/account?checkout=cancelled`,
      client_reference_id: userId,
      metadata: {
        clerkUserId: userId,
        purpose: "myvobiz-pro-subscription",
      },
    });

    return res.status(200).json({ ok: true, url: session.url, v: 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
