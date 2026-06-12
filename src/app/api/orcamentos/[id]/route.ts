import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Historico de orcamentos desativado neste site.' }, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Historico de orcamentos desativado neste site.' }, { status: 410 });
}
