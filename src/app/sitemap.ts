import type { MetadataRoute } from 'next';
import { getProdutosSqlServer } from '@/lib/db-sqlserver';
import { SITE_URL } from '@/lib/site-config';

const staticRoutes = [
  '',
  '/produtos',
  '/carrinho',
  '/contato',
  '/faq',
  '/sobre',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const produtos = await getProdutosSqlServer(20000);

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/produtos' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : route === '/produtos' ? 0.9 : 0.7,
  }));

  const productUrls: MetadataRoute.Sitemap = produtos.map((produto) => ({
    url: `${SITE_URL}/produtos/${encodeURIComponent(produto.id)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticUrls, ...productUrls];
}
