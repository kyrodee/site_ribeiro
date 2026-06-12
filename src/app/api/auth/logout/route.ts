import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth-server';

export async function POST() {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
