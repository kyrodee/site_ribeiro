import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import gis from 'g-i-s';

const prisma = new PrismaClient();

const rawData = `
LOC-C01 A02
BORRACHA PORTA MBB ACELLO 715/915
9796977098

LOC-C01 F11
CREMALHEIRA CATRACA
41326/41310

LOC-C01 G09
BIELA COMPRESSOR VW 2RG14501A II14872 KNORR
5

LOC-C01 G11
BIELA COMPRESSOR 85MM ELET
9111457382/KGB23

LOC-D01 B20
VALVULA BOMBA OLEO VOLVO N/NL/FH
471707

LOC-D01 D13
JUNTA BOMBA AGUA VOLVO FH
D13

LOC-D02 B03
JOGO JUNTA TURBINA DC13 EURO 5
2137185

LOC-D02 B06
SENSOR ABS RETO FH/FM/2015 EM DIANTE
21296849

LOC-D02 B17
VALV CAMBIO CAIXA VOLVO FH12 CX ZF
16672798/43

LOC-D02 F02
REP BOMBA OLEO VOLVO
59803K

LOC-D02 F06
GARFO EMBREAGEM VOLVO FH CX ZF
1667058

LOC-D03 D05
ARRUELA CUBO VOLVO N/NL10/12/B58
1522983

LOC-D03 D12
SENSOR PRESSAO VENTILACAO CARTER VOLVO FH/FM/NH
—

LOC-D03 D13
JUNTA COL ADMISSAO VOLVO FH
477314

LOC-D03 E05
JUNTA TUBO AGUA VOLVO D12C/D12D
8130185

LOC-D03 E09
BUJAO CAMBIO VT / I-SHIFT
20366642

LOC-D03 E16
CALCO VALV WEB 3,85 VOLVO
1677366

LOC-D03 E17
CALCO VALV WEB 3,60 VOLVO
1677361

LOC-D03 E20
CALCO VALV WEB 3,45 VOLVO
1677358

LOC-D04 C06
SENSOR NIVEL AGUA RESERV VOLVO FH
21271982

LOC-D04 D15
REP CANECA REDUZIDA VOLVO FH CAMBIO VT
309257

LOC-D04 E09
TUBO CONEXAO CAVALETE AGUA VOLVO FH
D13

LOC-D04 E16
INTERRUPTOR VOLVO FH12
20953569/20942844

LOC-D05 B07
BOTAO ACIONA VIDRO VOLVO FH MODERNO LE
2075291

LOC-D05 B08
BOTAO ACIONAMENTO VIDRO LD
22566514

LOC-D05 C20
REP PINCA FREIO VOLVO FH PARCIAL LD
—

LOC-D06 D04
VALV TERMOSTATICA VOLVO FH D13/D9A 82º
2056024

LOC-E01 B10
SENSOR ABS SCANIA S4/5 LE 90º TRAS
2675MM

LOC-E01 B11
TAMPAO VEDACAO VALV D'AGUA SC SERIE 4
142201

LOC-E01 B12
LIMITADOR PORTA SCANIA 112/113
296815

LOC-E01 C09
LUVA ESPACADORA CABINE SCANIA SERIE
4

LOC-E01 C13
CONEXAO TUBO COMPRESSOR SCANIA SERIE
5

LOC-E01 D03
TAMPA INF TANQUE SCANIA 12MM
1377258

LOC-E02 A02
TUBO FLANGEADO OLEO SCANIA S5/DC13
1727524

LOC-E02 A03
FECHADURA PORTA SCANIA 112/113/143 LD
296212

LOC-E02 B02
ARRUELA ESPACADORA CABINE SCANIA SERIE
4

LOC-E02 B09
BATENTE FECHADURA CABINE SCANIA SERIE
4

LOC-E03 E04
UNIDADE ABERTURA PORTA SCANIA SERIE 4 LE
134690

LOC-E03 E16
VALV TERMOSTATICA SCANIA 83º
VT359.83

LOC-E04 B01
UNIAO RADIADOR D'AGUA SCANIA 114/124
1374307

LOC-E04 B02
TAMPA CARCACA EMBREAGEM P/G/R SERIE 5
179699

LOC-E04 B12
SENSOR VELOCIDADE SCANIA/FORD PINO CHATO
11114

LOC-E04 C01
TAMPA CARCACA EMBREAGEM SCANIA S4
1379922

LOC-E04 D12
BUCHA COLETOR ESCAPE SCANIA 114/124
1493164

LOC-E04 E16
SENSOR PEDAL FREIO SCANIA S5 P/G/R
—

LOC-E05 A04
FLANGE EIXO DIFERENCIA SCANIA SERIE 5/6/7
239711

LOC-E05 B20
VALVULA SOLENOIDE SERIE 4/5 TODOS
1720083

LOC-E05 E10
JUNTA SUPORTE MONTANGEM COMP SC P/G/R
177509

LOC-E06 B10
VALV SUSPENSAO CABINE SCANIA P/G/R/T/NTG
209335

LOC-E06 C18
PARAF COL ESCAPE SCANIA 112/113/124
1108053
`;

// Helper to search image
const searchImage = (query: string): Promise<string | null> => {
  return new Promise((resolve) => {
    gis(query, (error: any, results: any[]) => {
      if (error || !results || results.length === 0) {
        resolve(null);
      } else {
        // Pega a primeira imagem válida (URL http/https)
        const validImage = results.find(r => r.url && r.url.startsWith('http'));
        resolve(validImage ? validImage.url : null);
      }
    });
  });
};

async function main() {
  const blocks = rawData.trim().split('\n\n');
  const produtos = [];
  
  console.log(`Encontrados ${blocks.length} blocos de texto.`);

  for (let i = 0; i < blocks.length; i++) {
    const lines = blocks[i].trim().split('\n');
    // lines[0] = LOC... (ignorar)
    // lines[1] = Nome
    // lines[2] = Ref
    if (lines.length >= 3) {
      const nome = lines[1].trim().toUpperCase();
      const ref = lines[2].trim() === '—' ? 'SEM REF' : lines[2].trim();
      const id = `PROD-${(i + 1).toString().padStart(3, '0')}`;

      // Define categoria baseada no nome
      let categoria = 'Outros';
      const n = nome.toUpperCase();
      if (n.includes('VALV')) categoria = 'Válvulas';
      else if (n.includes('SENSOR') || n.includes('INT ') || n.includes('INTERRUPTOR')) categoria = 'Elétrica/Sensores';
      else if (n.includes('JUNTA') || n.includes('JG JUNTA')) categoria = 'Juntas/Motor';
      else if (n.includes('BOMBA')) categoria = 'Bombas';
      else if (n.includes('EMBREAGEM')) categoria = 'Embreagem';
      else if (n.includes('CABINE') || n.includes('PORTA')) categoria = 'Cabine';

      // Extrai marca provável do nome
      let marca = '';
      if (n.includes('VOLVO')) marca = 'Volvo';
      else if (n.includes('SCANIA') || n.includes('SC ')) marca = 'Scania';
      else if (n.includes('MBB')) marca = 'Mercedes-Benz';
      else if (n.includes('VW') || n.includes('VOLKS')) marca = 'Volkswagen';
      else if (n.includes('FORD')) marca = 'Ford';

      produtos.push({
        id,
        nome,
        referencia: ref,
        codigoInterno: \`CI-\${Math.floor(Math.random() * 90000) + 10000}\`,
        preco: Math.floor(Math.random() * 500) + 50,
        estoque: Math.floor(Math.random() * 20) + 1,
        categoria,
        marca
      });
    }
  }

  // 1. Gera o arquivo db-sqlserver.ts mockado com os produtos extraídos
  const dbFileContent = \`import sql from 'mssql';

const sqlConfig = {
  user: process.env.SQLSERVER_USER || '',
  password: process.env.SQLSERVER_PASSWORD || '',
  database: process.env.SQLSERVER_DATABASE || '',
  server: process.env.SQLSERVER_SERVER || 'localhost',
  port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  options: { encrypt: false, trustServerCertificate: true }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getSqlServerPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig).then(pool => pool).catch(err => {
      console.error('Database Connection Failed! Bad Config: ', err);
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

export interface ProdutoSqlServer {
  id: string;
  nome: string;
  referencia: string;
  codigoInterno: string;
  preco: number | null;
  estoque: number;
  categoria: string | null;
  marca: string | null;
}

export async function getProdutosSqlServer(): Promise<ProdutoSqlServer[]> {
  return \${JSON.stringify(produtos, null, 2)};
}
\`;

  fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'db-sqlserver.ts'), dbFileContent);
  console.log('✅ Arquivo db-sqlserver.ts gerado com 50 produtos.');

  // 2. Busca imagens e insere no Prisma
  console.log('Iniciando busca de imagens e população do SQLite...');
  for (const p of produtos) {
    // Busca no DB primeiro para não duplicar
    const existe = await prisma.produtoEnriquecido.findUnique({ where: { slug: \`\${p.id}-slug\` } });
    
    if (!existe) {
      console.log(\`Buscando foto para: \${p.nome} (\${p.marca || ''})\`);
      const imageUrl = await searchImage(\`\${p.nome} \${p.marca || ''} peça caminhão\`);
      
      const descricaoGerada = \`\${p.nome}. Peça original com alto padrão de qualidade para o seu caminhão \${p.marca || ''}. Confira a compatibilidade usando a referência \${p.referencia}.\`;

      await prisma.produtoEnriquecido.create({
        data: {
          idOriginal: p.id,
          imagemUrl: imageUrl,
          descricao: descricaoGerada,
          slug: \`\${p.id}-slug\`,
          destaque: Math.random() > 0.8, // 20% de chance de ser destaque
          visivel: true,
          categoriaAjustada: p.categoria
        }
      });
      console.log(\`✅ Salvo no DB: \${p.nome} (\${imageUrl ? 'COM IMAGEM' : 'SEM IMAGEM'})\`);
      // Sleep pequeno para não estourar rate limit se a lib usar request direta
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('🎉 Processo de seed concluído!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
