/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import styles from './page.module.css';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';
import AddToCartActions from '@/components/AddToCartActions';
import ProductTabs from '@/components/ProductTabs';
import { SERVICE_REGION } from '@/lib/site-config';

export default async function ProdutoDetalhes({ params }: { params: Promise<{ slug: string }> }) {
  const produtos = await getProdutosSqlServer(20000);
  const resolvedParams = await params;
  const produto = produtos.find(p => p.id === resolvedParams.slug);

  if (!produto) notFound();

  const relacionados = produtos
    .filter((item) => item.id !== produto.id && item.categoria === produto.categoria)
    .sort((left, right) => Number(right.marca === produto.marca) - Number(left.marca === produto.marca))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: produto.nome,
    image: produto.imagemUrl || 'https://www.ribeiroautopecas.com.br/placeholder.png',
    description: `Peça para linha pesada. Ref: ${produto.referencia}`,
    sku: produto.codigoInterno,
    brand: {
      '@type': 'Brand',
      name: produto.marca || 'Genérico',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: produto.preco || '0.00',
      availability: produto.estoque > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className={`container ${styles.productPage}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.breadcrumb}>
        <Link href="/"><ChevronLeft size={16} /> Voltar para o início</Link>
        <span>/</span>
        <Link href={`/produtos?cat=${encodeURIComponent(produto.categoria || '')}`}>{produto.categoria || 'Diversos'}</Link>
        <span>/</span>
        <span className={styles.currentCrumb}>{produto.codigoInterno}</span>
      </div>

      <div className={styles.productGrid}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImagePlaceholder}>
            {produto.imagemUrl ? (
              <img src={produto.imagemUrl} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'calc(var(--radius-lg) - 2px)' }} />
            ) : (
              <div className={styles.noImage}><span>Imagem indisponível</span></div>
            )}
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{produto.categoria || 'Diversos'}</span>
            {produto.estoque > 0 ? (
              <span className="badge-stock">Em estoque</span>
            ) : (
              <span className="badge-no-stock">Sob encomenda</span>
            )}
          </div>

          <h1 className={styles.title}>{produto.nome}</h1>

          <div className={styles.references}>
            <p><strong>Marca:</strong> {produto.marca || 'Não informada'}</p>
            <p><strong>Cód. Interno:</strong> {produto.codigoInterno}</p>
            <p><strong>Referência:</strong> {produto.referencia}</p>
            {produto.ncm && <p><strong>NCM:</strong> {produto.ncm}</p>}
          </div>

          <div className={styles.priceContainer}>
            {produto.preco ? (
              <div className={styles.price}>
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </div>
            ) : (
              <div className={styles.price} style={{ fontSize: '1.75rem', color: 'var(--text-muted)' }}>
                Preço sob consulta
              </div>
            )}
            <p className={styles.priceConditions}>Confirme aplicação, disponibilidade e condição de pagamento com a loja.</p>
          </div>

          <AddToCartActions produto={produto} />

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <Truck size={24} color="var(--primary-blue)" />
              <div>
                <strong>Entrega rápida</strong>
                <p>Entregamos em {SERVICE_REGION}</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={24} color="var(--primary-blue)" />
              <div>
                <strong>Compra assistida</strong>
                <p>Conferência por referência, código e aplicação</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs
        nome={produto.nome}
        referencia={produto.referencia}
        codigoInterno={produto.codigoInterno}
        marca={produto.marca}
        categoria={produto.categoria}
        estoque={produto.estoque}
        unidade={produto.unidade}
        ncm={produto.ncm}
      />

      {relacionados.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className="section-title">Produtos relacionados</h2>
          <div className="grid-products" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {relacionados.map(rel => (
              <div key={rel.id} className="card">
                <div className={styles.relatedImage}>
                  <span>Imagem indisponível</span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', minHeight: '2.5rem', overflow: 'hidden', lineHeight: '1.4', color: 'var(--text-dark)' }}>{rel.nome}</h3>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: '800', fontSize: '1.1rem' }}>{rel.preco ? `R$ ${rel.preco.toFixed(2).replace('.', ',')}` : 'Sob consulta'}</span>
                  <Link href={`/produtos/${rel.id}`} className="btn-outline" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.85rem' }}>Ver peça</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
