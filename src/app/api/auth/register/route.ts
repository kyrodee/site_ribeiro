import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Cadastro desativado. O atendimento acontece pelo WhatsApp.' }, { status: 410 });
}
