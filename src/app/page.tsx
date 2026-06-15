/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';
import HeroSearch from '@/components/HeroSearch';
import BrandCarousel from '@/components/BrandCarousel';
import { Clock, Droplet, Settings, ShieldCheck, Truck, Wrench, Zap } from 'lucide-react';
import styles from './page.module.css';
import { createWhatsappUrl, SERVICE_REGION } from '@/lib/site-config';

export default async function Home() {
  const produtos = await getProdutosSqlServer(9);
  const destaques = produtos.slice(0, 9);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContent}`}>
          <h1>A Força que o seu Caminhão Precisa</h1>
          <p>Mais de 11.000 itens de linha pesada catalogados para manter sua frota rodando com segurança.</p>
          <HeroSearch />
        </div>
      </section>

      <section className={styles.benefitsBar}>
        <div className={`container ${styles.benefitsGrid}`}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}><Truck size={32} /></div>
            <h3>Envio Nacional</h3>
            <p>Envio para {SERVICE_REGION}</p>
          </div>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}><ShieldCheck size={32} /></div>
            <h3>Garantia de Fábrica</h3>
            <p>Peças com garantia de procedência</p>
          </div>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}><Wrench size={32} /></div>
            <h3>Suporte Especializado</h3>
            <p>Equipe pronta para tirar dúvidas</p>
          </div>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}><Clock size={32} /></div>
            <h3>Atendimento Ágil</h3>
            <p>Orçamentos rápidos via WhatsApp</p>
          </div>
        </div>
      </section>

      <section className={`container ${styles.categoriesSection}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Categorias Populares</h2>
            <p style={{ color: 'var(--text-muted)' }}>Filtre por sistema, marca, código ou referência</p>
          </div>
          <Link href="/produtos" style={{ color: 'var(--secondary-blue)', fontWeight: '600' }}>Ver todas &rarr;</Link>
        </div>
        <div className={styles.categoriesGrid}>
          <Link href="/produtos?cat=Motor" className={styles.categoryCard}>
            <Settings size={40} className={styles.categoryIcon} />
            <h3>Motor</h3>
          </Link>
          <Link href="/produtos?cat=Freios" className={styles.categoryCard}>
            <ShieldCheck size={40} className={styles.categoryIcon} />
            <h3>Freios</h3>
          </Link>
          <Link href="/produtos?cat=Eletrica%2FSensores" className={styles.categoryCard}>
            <Zap size={40} className={styles.categoryIcon} />
            <h3>Elétrica</h3>
          </Link>
          <Link href="/produtos?cat=Bombas" className={styles.categoryCard}>
            <Droplet size={40} className={styles.categoryIcon} />
            <h3>Bombas</h3>
          </Link>
          <Link href="/produtos?cat=Cabine" className={styles.categoryCard}>
            <Truck size={40} className={styles.categoryIcon} />
            <h3>Cabine</h3>
          </Link>
        </div>
      </section>

      <section className={`container ${styles.featuredSection}`}>
        <h2 className="section-title">Sugestões para Você</h2>
        <div className="grid-products">
          {destaques.map((produto) => (
            <div key={produto.id} className="card">
              <div className={styles.productImagePlaceholder}>
                {produto.imagemUrl ? (
                  <img src={produto.imagemUrl} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className={styles.noImage}><span>Imagem indisponível</span></div>
                )}
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productCategory}>{produto.categoria || 'Diversos'}</span>
                <h3 className={styles.productName}>{produto.nome}</h3>
                <div className={styles.productRefs}>
                  <span><strong>Ref:</strong> {produto.referencia}</span>
                  <span><strong>Cód:</strong> {produto.codigoInterno}</span>
                </div>
                <div className={styles.productFooter}>
                  {produto.preco ? (
                    <span className={styles.productPrice}>
                      R$ {produto.preco.toFixed(2).replace('.', ',')}
                    </span>
                  ) : (
                    <span className={styles.productPrice}>Sob consulta</span>
                  )}
                  <Link href={`/produtos/${produto.id}`} className="btn-outline">
                    Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.brandsSection}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--surface-white)' }}>Trabalhamos com as Melhores Marcas</h2>
          <p style={{ color: '#E5E7EB', maxWidth: '600px', margin: '0 auto' }}>
            Peças originais de reposição e componentes paralelos premium das marcas mais confiáveis do mercado.
          </p>
        </div>

        <BrandCarousel />
      </section>

      <section className="container">
        <div className={styles.ctaBanner}>
          <h2>Não encontrou a peça que procurava?</h2>
          <p>Nossa equipe consulta o catálogo e ajuda a confirmar a peça certa pelo código, referência ou aplicação.</p>
          <a href={createWhatsappUrl('Olá! Vim pelo site e não encontrei a peça que preciso. Podem me ajudar?')} target="_blank" rel="noopener noreferrer" className={styles.ctaWhatsapp}>
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
