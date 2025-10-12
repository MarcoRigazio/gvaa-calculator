import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CheckoutBody = {
  priceId?: string;
  quantity?: number;
  success_url?: string;
  cancel_url?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, use: "POST /api/checkout", v: 3 });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { priceId, success_url, cancel_url, quantity } = (req.body ?? {}) as CheckoutBody;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    // derive absolute URLs if not provided
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = req.headers.host || "localhost:3000";
    const origin = `${proto}://${host}`;

    const qty = Math.max(1, Number.isFinite(Number(quantity)) ? Number(quantity) : 1);

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // one-time price
      line_items: [{ price: priceId, quantity: qty }],
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      success_url:
        success_url ??
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url ?? `${origin}/checkout/cancel`,
    });

    return res.status(200).json({ ok: true, url: session.url, v: 3 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
