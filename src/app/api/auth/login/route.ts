import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, setSessionCookie } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
    }

    const user = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 400 });
    }

    const isValid = verifyPassword(password, user.senha);

    if (!isValid) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 400 });
    }

    // Cria o cookie de sessão no navegador
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
