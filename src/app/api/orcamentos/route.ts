import { NextResponse } from 'next/server';

const disabledMessage = 'Orcamentos no site estao desativados. Use o carrinho local e finalize pelo WhatsApp.';

export async function GET() {
  return NextResponse.json({ error: disabledMessage }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: disabledMessage }, { status: 410 });
}
