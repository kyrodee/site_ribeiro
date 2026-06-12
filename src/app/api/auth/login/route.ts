import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Login desativado. O atendimento acontece pelo WhatsApp.' }, { status: 410 });
}
