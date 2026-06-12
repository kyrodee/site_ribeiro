import type { ProdutoSqlServer } from './db-sqlserver';

export type ProductOrder = 'relevancia' | 'nome' | 'menor-preco' | 'maior-preco' | 'estoque';

type ProductIndex = {
  produto: ProdutoSqlServer;
  brand: string;
  category: string;
  codeCompact: string;
  ncmCompact: string;
  name: string;
  referenceCompact: string;
  searchable: string;
  tokens: string[];
};

const STOP_WORDS = new Set([
  'a',
  'as',
  'c',
  'com',
  'da',
  'das',
  'de',
  'diant',
  'do',
  'dos',
  'e',
  'em',
  'o',
  'os',
  'p',
  'para',
  's',
  'sem',
  'todos',
  'tras',
  'traseiro',
]);

const ALIASES: Record<string, string[]> = {
  alternador: ['alt'],
  amort: ['amortecedor'],
  amortecedor: ['amort'],
  arrefecimento: ['radiador', 'agua', 'aditivo', 'mangueira'],
  bateria: ['bat'],
  bomba: ['bombas'],
  cabine: ['cab', 'porta', 'grade', 'paralama', 'retrovisor'],
  cambio: ['camb', 'transmissao'],
  cardan: ['transmissao'],
  cilindro: ['cil'],
  cod: ['codigo'],
  codigo: ['cod'],
  direcao: ['dir'],
  eletrica: ['eletrico', 'sensor', 'alternador', 'arranque', 'chicote', 'rele'],
  eletrico: ['eletrica'],
  embreagem: ['emb'],
  farol: ['iluminacao', 'luz'],
  filtro: ['filtros'],
  freio: ['freios', 'pastilha', 'tambor', 'disco', 'pinca', 'sapata'],
  freios: ['freio'],
  iluminacao: ['farol', 'lanterna', 'pisca', 'luz'],
  lanterna: ['iluminacao'],
  mang: ['mangueira'],
  mangueira: ['mang'],
  mb: ['mercedes', 'mercedes benz', 'mbb'],
  mbb: ['mercedes', 'mercedes benz', 'mb'],
  mercedes: ['mbb', 'mb', 'mercedes benz'],
  motor: ['pistao', 'biela', 'cabecote', 'junta', 'retentor'],
  peca: ['produto'],
  pecas: ['produtos'],
  radiador: ['arrefecimento'],
  ref: ['referencia'],
  referencia: ['ref'],
  rele: ['rele', 'eletrica'],
  retentor: ['motor', 'vedacao'],
  scan: ['scania'],
  suspensao: ['susp', 'amortecedor', 'mola', 'bucha'],
  susp: ['suspensao'],
  valv: ['valvula'],
  valvula: ['valv'],
  volks: ['volkswagen', 'vw'],
  volkswagen: ['vw', 'volks'],
  vv: ['volvo'],
  vw: ['volkswagen', 'volks'],
};

export function normalizeSearchText(value: string | null | undefined) {
  if (!value) return '';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function compactSearchText(value: string | null | undefined) {
  return normalizeSearchText(value).replace(/\s+/g, '');
}

export function productMatchesFacet(value: string | null | undefined, filter: string | null) {
  if (!filter) return true;
  return normalizeSearchText(value) === normalizeSearchText(filter);
}

export function normalizeProductOrder(value: string | null): ProductOrder {
  if (value === 'menor-preco' || value === 'maior-preco' || value === 'estoque' || value === 'nome') {
    return value;
  }

  return 'relevancia';
}

export function getQueryTerms(query: string | null | undefined) {
  return normalizeSearchText(query)
    .split(' ')
    .filter(Boolean)
    .filter((term) => term.length > 1 || /\d/.test(term))
    .filter((term) => !STOP_WORDS.has(term));
}

export function searchProducts(produtos: ProdutoSqlServer[], query: string | null | undefined) {
  const terms = Array.from(new Set(getQueryTerms(query))).slice(0, 12);
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = compactSearchText(query);

  if (!normalizedQuery || terms.length === 0) {
    return sortProducts(produtos, 'nome');
  }

  const indexed = produtos.map(indexProduct);
  const scored = indexed
    .map((item) => scoreProduct(item, terms, normalizedQuery, compactQuery))
    .filter((result) => result.matchedTerms === terms.length || (terms.length === 1 && result.score >= 120));

  if (scored.length === 0) {
    return indexed
      .map((item) => scoreProduct(item, terms, normalizedQuery, compactQuery, true))
      .filter((result) => result.score > 0)
      .sort(compareScored)
      .map((result) => result.produto);
  }

  return scored.sort(compareScored).map((result) => result.produto);
}

export function sortProducts(produtos: ProdutoSqlServer[], order: ProductOrder) {
  const sorted = [...produtos];

  sorted.sort((left, right) => {
    if (order === 'menor-preco') return getPriceSortValue(left, 'asc') - getPriceSortValue(right, 'asc') || byName(left, right);
    if (order === 'maior-preco') return getPriceSortValue(right, 'desc') - getPriceSortValue(left, 'desc') || byName(left, right);
    if (order === 'estoque') return right.estoque - left.estoque || byName(left, right);
    return byName(left, right);
  });

  return sorted;
}

function expandTerm(term: string) {
  return [term, ...(ALIASES[term] || [])]
    .flatMap((value) => normalizeSearchText(value).split(' '))
    .filter(Boolean);
}

function indexProduct(produto: ProdutoSqlServer): ProductIndex {
  const name = normalizeSearchText(produto.nome);
  const brand = normalizeSearchText(produto.marca);
  const category = normalizeSearchText(produto.categoria);
  const reference = normalizeSearchText(produto.referencia);
  const code = normalizeSearchText(produto.codigoInterno);
  const ncm = normalizeSearchText(produto.ncm);
  const aliasText = [brand, category].flatMap((term) => term.split(' ').flatMap(expandTerm)).join(' ');
  const searchable = normalizeSearchText([
    name,
    brand,
    category,
    reference,
    code,
    ncm,
    produto.unidade,
    aliasText,
  ].join(' '));

  return {
    produto,
    brand,
    category,
    codeCompact: compactSearchText(produto.codigoInterno),
    ncmCompact: compactSearchText(produto.ncm),
    name,
    referenceCompact: compactSearchText(produto.referencia),
    searchable,
    tokens: Array.from(new Set(searchable.split(' ').filter(Boolean))),
  };
}

function scoreProduct(item: ProductIndex, terms: string[], normalizedQuery: string, compactQuery: string, loose = false) {
  let score = 0;
  let matchedTerms = 0;

  if (compactQuery) {
    if (item.codeCompact === compactQuery || item.referenceCompact === compactQuery) score += 1400;
    else if (item.codeCompact.startsWith(compactQuery) || item.referenceCompact.startsWith(compactQuery)) score += 900;
    else if (item.codeCompact.includes(compactQuery) || item.referenceCompact.includes(compactQuery) || item.ncmCompact.includes(compactQuery)) score += 650;
  }

  if (item.name === normalizedQuery) score += 700;
  else if (item.name.startsWith(normalizedQuery)) score += 380;
  else if (item.name.includes(normalizedQuery)) score += 260;

  for (const term of terms) {
    const termScore = scoreTerm(item, term, loose);
    if (termScore > 0) {
      matchedTerms += 1;
      score += termScore;
    }
  }

  if (matchedTerms === terms.length) score += terms.length * 80;
  if (item.produto.estoque > 0) score += 8;

  return { produto: item.produto, score, matchedTerms };
}

function scoreTerm(item: ProductIndex, term: string, loose: boolean) {
  const variants = Array.from(new Set(expandTerm(term)));
  let bestScore = 0;

  for (const variant of variants) {
    bestScore = Math.max(bestScore, scoreTermVariant(item, variant, loose));
  }

  return bestScore;
}

function scoreTermVariant(item: ProductIndex, term: string, loose: boolean) {
  const compactTerm = compactSearchText(term);

  if (!compactTerm) return 0;
  if (item.codeCompact === compactTerm || item.referenceCompact === compactTerm || item.ncmCompact === compactTerm) return 700;
  if (item.codeCompact.startsWith(compactTerm) || item.referenceCompact.startsWith(compactTerm)) return 520;
  if (item.codeCompact.includes(compactTerm) || item.referenceCompact.includes(compactTerm) || item.ncmCompact.includes(compactTerm)) return 420;
  if (item.brand === term || item.category === term) return 260;
  if (item.name.startsWith(term)) return 220;
  if (item.name.includes(term)) return 170;
  if (item.tokens.some((token) => token === term)) return 150;
  if (item.tokens.some((token) => token.startsWith(term) || term.startsWith(token))) return 90;
  if (loose && term.length >= 4 && item.tokens.some((token) => isNearToken(term, token))) return 55;

  return 0;
}

function isNearToken(term: string, token: string) {
  if (token.length < 4 || Math.abs(term.length - token.length) > 2) return false;
  return levenshtein(term, token) <= (term.length > 6 ? 2 : 1);
}

function levenshtein(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array.from({ length: right.length + 1 }, () => 0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function compareScored(
  left: { produto: ProdutoSqlServer; score: number },
  right: { produto: ProdutoSqlServer; score: number },
) {
  return right.score - left.score || right.produto.estoque - left.produto.estoque || byName(left.produto, right.produto);
}

function byName(left: ProdutoSqlServer, right: ProdutoSqlServer) {
  return left.nome.localeCompare(right.nome, 'pt-BR', { sensitivity: 'base', numeric: true });
}

function getPriceSortValue(produto: ProdutoSqlServer, direction: 'asc' | 'desc') {
  if (produto.preco === null || produto.preco === undefined) {
    return direction === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  return produto.preco;
}
