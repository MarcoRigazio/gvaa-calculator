import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// (Optional) Request shape for your editor only
// type CheckoutRequest = {
//   priceId?: string;
//   lookupKey?: string;
//   lineItems?: { price: string; quantity?: number }[];
//   successUrl?: string;
//   cancelUrl?: string;
// };

export async function POST(req: Request) {
  // const body = (await req.json()) as CheckoutRequest; // use when ready
  return NextResponse.json({ ok: true });
}
