import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status || !['PENDENTE', 'ATENDIDO', 'CANCELADO'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
    }

    const resolvedParams = await params;

    const updated = await prisma.orcamento.update({
      where: { id: resolvedParams.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error);
    return NextResponse.json({ error: 'Erro interno ao atualizar orçamento.' }, { status: 500 });
  }
}
