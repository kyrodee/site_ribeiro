import { NextResponse } from 'next/server';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';

export async function POST() {
  try {
    const produtos = await getProdutosSqlServer(20000);
    const pendentes = produtos.slice(0, 50);
    const amostra = pendentes.slice(0, 5).map((produto) => ({
      idOriginal: produto.id,
      slug: `${produto.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${produto.id.toLowerCase()}`,
      descricao: `${produto.nome}. Ideal para reposição em linha pesada. Consulte a aplicação correta pela referência ${produto.referencia} ou código interno ${produto.codigoInterno}.`,
    }));

    return NextResponse.json({
      success: true,
      message: `${pendentes.length} produtos simulados para enriquecimento.`,
      produtosEnriquecidos: pendentes.length,
      amostra,
    });
  } catch (error) {
    console.error('Erro no script de enriquecimento:', error);
    return NextResponse.json({ success: false, error: 'Falha no processamento' }, { status: 500 });
  }
}
