import { getProdutosSqlServer } from './src/lib/db-sqlserver';
import { searchProducts } from './src/lib/product-search';

async function test() {
  try {
    console.log('Carregando produtos...');
    const produtos = await getProdutosSqlServer(20000);
    console.log(`Total de produtos carregados: ${produtos.length}`);

    const queries = ['BIELA', '1727524', 'VALVULA', 'freio scania', 'bomba'];
    for (const q of queries) {
      console.log(`\nBuscando por: "${q}"`);
      const results = searchProducts(produtos, q);
      console.log(`Resultados encontrados: ${results.length}`);
      if (results.length > 0) {
        console.log('Top 3 resultados:');
        results.slice(0, 3).forEach((p, idx) => {
          console.log(`  ${idx+1}. Nome: ${p.nome} | Cod: ${p.codigoInterno} | Ref: ${p.referencia} | Marca: ${p.marca}`);
        });
      }
    }
  } catch (err) {
    console.error('Erro no teste de busca:', err);
  }
}

test();
