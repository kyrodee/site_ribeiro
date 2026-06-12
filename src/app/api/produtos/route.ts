import { NextResponse } from 'next/server';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';
import { productMatchesFacet, searchProducts, sortProducts } from '@/lib/product-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const categoria = searchParams.get('cat');
  const marca = searchParams.get('marca');
  const idsParam = searchParams.get('ids');
  const limit = Math.min(Number.parseInt(searchParams.get('limit') || '12', 10) || 12, 100);

  let produtos = await getProdutosSqlServer(20000);

  if (idsParam) {
    const ids = idsParam.split(',').filter(Boolean);
    produtos = produtos.filter((p) => ids.includes(p.id));
  } else {
    produtos = produtos.filter((produto) =>
      productMatchesFacet(produto.categoria, categoria) &&
      productMatchesFacet(produto.marca, marca)
    );

    produtos = q ? searchProducts(produtos, q) : sortProducts(produtos, 'nome');
  }

  return NextResponse.json(produtos.slice(0, limit));
}
