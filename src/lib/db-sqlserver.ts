import fs from 'node:fs';
import path from 'node:path';

export interface ProdutoSqlServer {
  id: string;
  nome: string;
  referencia: string;
  codigoInterno: string;
  preco: number | null;
  estoque: number;
  categoria: string | null;
  marca: string | null;
  imagemUrl?: string | null;
  ncm?: string | null;
  unidade?: string | null;
}

const mockProdutos: ProdutoSqlServer[] = [
  {
    id: 'PROD-001',
    nome: 'DISCO DE FREIO SCANIA SERIE 5',
    referencia: 'REF-40566',
    codigoInterno: 'CI-67175',
    preco: 449.9,
    estoque: 20,
    categoria: 'Freios',
    marca: 'Scania',
    imagemUrl: null,
  },
  {
    id: 'PROD-002',
    nome: 'BOMBA INJETORA DAF CONSTELLATION',
    referencia: 'REF-57285',
    codigoInterno: 'CI-13207',
    preco: 2980.99,
    estoque: 8,
    categoria: 'Bombas',
    marca: 'DAF',
    imagemUrl: null,
  },
  {
    id: 'PROD-003',
    nome: 'ALTERNADOR MAN DELIVERY',
    referencia: 'REF-91213',
    codigoInterno: 'CI-37801',
    preco: 1222.99,
    estoque: 13,
    categoria: 'Eletrica/Sensores',
    marca: 'MAN',
    imagemUrl: null,
  },
];

let inventarioCache: ProdutoSqlServer[] | null = null;

export function getProdutosInventario(limit: number): ProdutoSqlServer[] {
  if (!inventarioCache) {
    const inventarioPath = path.join(process.cwd(), 'src', 'data', 'produtos-inventario.json');

    if (fs.existsSync(inventarioPath)) {
      try {
        const payload = JSON.parse(fs.readFileSync(inventarioPath, 'utf-8')) as { produtos?: ProdutoSqlServer[] };
        inventarioCache = payload.produtos || [];
      } catch (err) {
        console.error('Erro ao carregar produtos-inventario.json:', err);
        inventarioCache = [];
      }
    } else {
      inventarioCache = [];
    }
  }

  const produtos = inventarioCache.length > 0 ? inventarioCache : mockProdutos;

  return produtos.slice(0, limit).map((produto) => ({
    id: produto.id,
    nome: produto.nome.toUpperCase(),
    referencia: produto.referencia,
    codigoInterno: produto.codigoInterno,
    preco: produto.preco,
    estoque: produto.estoque,
    categoria: produto.categoria,
    marca: produto.marca,
    imagemUrl: produto.imagemUrl,
    ncm: produto.ncm,
    unidade: produto.unidade,
  }));
}

// Para manter compatibilidade com as rotas que chamavam getProdutosSqlServer
export async function getProdutosSqlServer(limit = 20000): Promise<ProdutoSqlServer[]> {
  return getProdutosInventario(limit);
}
