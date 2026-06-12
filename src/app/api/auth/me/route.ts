import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        nome: true,
        telefone: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
