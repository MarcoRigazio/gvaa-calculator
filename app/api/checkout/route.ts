import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, use: 'POST /api/checkout' });
}

export async function POST() {
  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' },
  });
}
