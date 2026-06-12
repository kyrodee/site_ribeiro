/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';
import {
  normalizeProductOrder,
  productMatchesFacet,
  searchProducts,
  sortProducts,
} from '@/lib/product-search';
import { ArrowDownAZ, Filter, Search } from 'lucide-react';
import styles from './page.module.css';
import { SITE_URL, STORE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Catálogo de Peças para Linha Pesada',
  description: 'Consulte peças para caminhões e ônibus por nome, código, referência, NCM, categoria ou marca. Monte sua lista e finalize pelo WhatsApp.',
  alternates: {
    canonical: `${SITE_URL}/produtos`,
  },
  openGraph: {
    title: `Catálogo de Peças | ${STORE_NAME}`,
    description: 'Mais de 11.000 itens de linha pesada catalogados para consulta rápida.',
    url: `${SITE_URL}/produtos`,
    images: ['/og-image.svg'],
  },
};

export default async function ProdutosList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const todosProdutos = await getProdutosSqlServer(20000);
  const resolvedParams = await searchParams;

  const categoria = typeof resolvedParams.cat === 'string' ? resolvedParams.cat : null;
  const busca = typeof resolvedParams.q === 'string' ? resolvedParams.q.trim() : null;
  const marcaFiltro = typeof resolvedParams.marca === 'string' ? resolvedParams.marca : null;
  const ordenacao = normalizeProductOrder(typeof resolvedParams.ordem === 'string' ? resolvedParams.ordem : null);
  const paginaAtual = Math.max(Number.parseInt(typeof resolvedParams.page === 'string' ? resolvedParams.page : '1', 10) || 1, 1);
  const produtosPorPagina = 60;

  const categoriasUnicas = (Array.from(new Set(todosProdutos.map(p => p.categoria).filter(Boolean))) as string[])
    .sort((left, right) => left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }));
  const marcasUnicas = (Array.from(new Set(todosProdutos.map(p => p.marca).filter(Boolean))) as string[])
    .sort((left, right) => left.localeCompare(right, 'pt-BR', { sensitivity: 'base' }));

  let produtos = todosProdutos.filter((produto) =>
    productMatchesFacet(produto.categoria, categoria) &&
    productMatchesFacet(produto.marca, marcaFiltro)
  );

  produtos = busca ? searchProducts(produtos, busca) : sortProducts(produtos, ordenacao === 'relevancia' ? 'nome' : ordenacao);

  if (busca && ordenacao !== 'relevancia') {
    produtos = sortProducts(produtos, ordenacao);
  }

  const totalProdutos = produtos.length;
  const totalPaginas = Math.max(Math.ceil(totalProdutos / produtosPorPagina), 1);
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaSegura - 1) * produtosPorPagina;
  const produtosPaginados = produtos.slice(inicio, inicio + produtosPorPagina);
  const ordemAtual = busca ? ordenacao : ordenacao === 'relevancia' ? 'nome' : ordenacao;

  const buildUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    if (categoria) params.set('cat', categoria);
    if (busca) params.set('q', busca);
    if (marcaFiltro) params.set('marca', marcaFiltro);
    if (ordemAtual !== 'relevancia' || !busca) params.set('ordem', ordemAtual);
    if (paginaSegura > 1) params.set('page', String(paginaSegura));

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== 'page') params.delete('page');
    if (params.get('ordem') === 'relevancia' && busca) params.delete('ordem');
    if (params.get('ordem') === 'nome' && !busca) params.delete('ordem');

    const query = params.toString();
    return query ? `/produtos?${query}` : '/produtos';
  };

  return (
    <div className={`container ${styles.produtosContainer}`}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.35rem' }}>
            {busca ? `Resultados para "${busca}"` : categoria ? categoria : 'Catalogo de Pecas'}
          </h1>
          <p className={styles.catalogSubtitle}>
            {totalProdutos.toLocaleString('pt-BR')} itens encontrados no inventario
          </p>
        </div>
        <form action="/produtos" className={styles.searchBar}>
          {categoria && <input type="hidden" name="cat" value={categoria} />}
          {marcaFiltro && <input type="hidden" name="marca" value={marcaFiltro} />}
          <input name="q" type="search" placeholder="Nome, codigo, referencia, NCM ou marca" defaultValue={busca || ''} />
          <button className="btn-primary" type="submit" aria-label="Buscar"><Search size={20} /></button>
        </form>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <details className={styles.filterDetails} open>
            <summary className={styles.filterSummary}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={18} /> Categorias</span>
            </summary>
            <div className={styles.filterContent}>
              <ul className={styles.categoryList}>
                <li>
                  <Link href={buildUrl('cat', null)} className={!categoria ? styles.active : ''}>Todas</Link>
                </li>
                {categoriasUnicas.map(cat => (
                  <li key={cat}>
                    <Link href={buildUrl('cat', cat)} className={productMatchesFacet(cat, categoria) ? styles.active : ''}>{cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          <details className={styles.filterDetails} open>
            <summary className={styles.filterSummary}>
              <span>Marcas</span>
            </summary>
            <div className={styles.filterContent}>
              <ul className={styles.categoryList}>
                <li>
                  <Link href={buildUrl('marca', null)} className={!marcaFiltro ? styles.active : ''}>Todas</Link>
                </li>
                {marcasUnicas.map(marca => (
                  <li key={marca}>
                    <Link href={buildUrl('marca', marca)} className={productMatchesFacet(marca, marcaFiltro) ? styles.active : ''}>{marca}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </aside>

        <div className={styles.mainContent}>
          <div className={styles.resultsToolbar}>
            <div className={styles.resultsCount}>
              {totalProdutos > 0
                ? `Mostrando ${inicio + 1}-${inicio + produtosPaginados.length} de ${totalProdutos} produtos`
                : 'Nenhum produto encontrado'}
            </div>
            <div className={styles.sortLinks} aria-label="Ordenacao">
              <ArrowDownAZ size={16} />
              {busca && (
                <Link href={buildUrl('ordem', 'relevancia')} className={ordemAtual === 'relevancia' ? styles.activeSort : ''}>Relevancia</Link>
              )}
              <Link href={buildUrl('ordem', 'nome')} className={ordemAtual === 'nome' ? styles.activeSort : ''}>Nome</Link>
              <Link href={buildUrl('ordem', 'estoque')} className={ordemAtual === 'estoque' ? styles.activeSort : ''}>Estoque</Link>
            </div>
          </div>

          <div className="grid-products">
            {produtosPaginados.map((produto) => (
              <div key={produto.id} className="card">
                <div className={styles.productImagePlaceholder}>
                  {produto.imagemUrl ? (
                    <img src={produto.imagemUrl} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.noImage}><span>Imagem indisponivel</span></div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productMetaLine}>
                    <span className={styles.productCategory}>{produto.categoria || 'Diversos'}</span>
                    {produto.marca && <span className={styles.productBrand}>{produto.marca}</span>}
                  </div>
                  <h3 className={styles.productName}>{produto.nome}</h3>
                  <div className={styles.productRefs}>
                    <span>Ref: {produto.referencia}</span>
                    <span>Cod: {produto.codigoInterno}</span>
                    {produto.ncm && <span>NCM: {produto.ncm}</span>}
                  </div>
                  <div className={styles.productFooter}>
                    <div>
                      <span className={styles.productPrice}>{produto.preco ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : 'Sob consulta'}</span>
                      <span className={`${styles.stockText} ${produto.estoque > 0 ? styles.stockInline : styles.stockNone}`}><span className={`${styles.stockDot} ${produto.estoque > 0 ? styles.stockDotGreen : styles.stockDotAmber}`}></span>{produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sob encomenda'}</span>
                    </div>
                    <Link href={`/produtos/${produto.id}`} className="btn-outline">
                      Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {totalProdutos === 0 && (
              <div className={styles.noResults}>
                <p>Nenhum produto encontrado com os filtros atuais.</p>
                <Link href="/produtos" className="btn-primary" style={{ marginTop: '1rem' }}>Limpar filtros</Link>
              </div>
            )}
          </div>

          {totalPaginas > 1 && (
            <nav className={styles.pagination} aria-label="Paginacao de produtos">
              <Link
                href={buildUrl('page', String(Math.max(paginaSegura - 1, 1)))}
                className={paginaSegura === 1 ? styles.disabledPage : ''}
              >
                Anterior
              </Link>
              <span className={styles.paginationInfo}>Pagina {paginaSegura} de {totalPaginas}</span>
              <Link
                href={buildUrl('page', String(Math.min(paginaSegura + 1, totalPaginas)))}
                className={paginaSegura === totalPaginas ? styles.disabledPage : ''}
              >
                Proxima
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
