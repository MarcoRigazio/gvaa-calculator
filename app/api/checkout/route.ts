import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ ok: true, use: 'POST /api/checkout' });
}

export async function POST(req: Request) {
  // your checkout logic here
  return NextResponse.json({ ok: true });
}
