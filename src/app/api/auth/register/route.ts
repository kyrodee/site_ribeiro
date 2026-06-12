import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const { email, password, nome, telefone } = await request.json();

    if (!email || !password || !nome) {
      return NextResponse.json({ error: 'Preencha os campos obrigatórios.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Verifica se já existe o e-mail cadastrado
    const existingUser = await prisma.usuario.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    // Cria o usuário
    const user = await prisma.usuario.create({
      data: {
        email: trimmedEmail,
        senha: hashedPassword,
        nome: nome.trim(),
        telefone: telefone ? telefone.trim() : null,
        role: 'USER', // papel padrão
      },
    });

    // Cria a sessão automaticamente
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
    console.error('Erro no registro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
