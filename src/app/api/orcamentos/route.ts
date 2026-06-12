import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const data = await request.json();

    const {
      clienteNome,
      clienteTelefone,
      entregaMetodo,
      cidade,
      bairro,
      endereco,
      formaPagamento,
      observacoes,
      itens,
    } = data;

    if (!clienteNome || !entregaMetodo || !formaPagamento || !itens || !Array.isArray(itens)) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    // Salva o orçamento no SQLite
    const orcamento = await prisma.orcamento.create({
      data: {
        usuarioId: session ? session.userId : null,
        clienteNome: clienteNome.trim(),
        clienteTelefone: clienteTelefone ? clienteTelefone.trim() : null,
        entregaMetodo,
        cidade: entregaMetodo === 'entrega' ? cidade?.trim() : null,
        bairro: entregaMetodo === 'entrega' ? bairro?.trim() : null,
        endereco: entregaMetodo === 'entrega' ? endereco?.trim() : null,
        formaPagamento,
        observacoes: observacoes ? observacoes.trim() : null,
        itensJson: JSON.stringify(itens),
        status: 'PENDENTE',
      },
    });

    return NextResponse.json(orcamento);
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar orçamento.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    let orcamentos;

    if (session.role === 'ADMIN') {
      // Admin vê todos os orçamentos recebidos
      orcamentos = await prisma.orcamento.findMany({
        orderBy: { dataCriacao: 'desc' },
      });
    } else {
      // Usuário comum vê apenas o seu histórico de orçamentos
      orcamentos = await prisma.orcamento.findMany({
        where: { usuarioId: session.userId },
        orderBy: { dataCriacao: 'desc' },
      });
    }

    return NextResponse.json(orcamentos);
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    return NextResponse.json({ error: 'Erro interno ao listar orçamentos.' }, { status: 500 });
  }
}
