import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, use: "POST /api/checkout" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { priceId, success_url, cancel_url, quantity = 1 } = req.body ?? {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // change to "payment" for one-time Prices
      line_items: [{ price: priceId, quantity }],
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      success_url: success_url ?? `${process.env.APP_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url ?? `${process.env.APP_BASE_URL}/checkout/cancel`,
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}
