const fs = require('fs');
const path = require('path');

const brands = ['Volvo', 'Scania', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Iveco', 'DAF', 'MAN'];
const categories = ['Motor', 'Freios', 'Cabine', 'Elétrica/Sensores', 'Bombas', 'Embreagem', 'Juntas/Motor', 'Iluminação', 'Suspensão'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const newProducts = [];

for (let i = 1; i <= 150; i++) {
  const brand = randomItem(brands);
  const category = randomItem(categories);
  
  let namePrefix = '';
  if (category === 'Motor') namePrefix = randomItem(['Pistão', 'Biela', 'Virabrequim', 'Cabeçote', 'Bronzina']);
  else if (category === 'Freios') namePrefix = randomItem(['Pastilha de Freio', 'Disco de Freio', 'Lona de Freio', 'Catraca de Freio', 'Tambor de Freio']);
  else if (category === 'Cabine') namePrefix = randomItem(['Borracha Porta', 'Maçaneta', 'Para-choque', 'Retrovisor', 'Tapete', 'Banco']);
  else if (category === 'Elétrica/Sensores') namePrefix = randomItem(['Sensor ABS', 'Alternador', 'Motor de Arranque', 'Chicote Elétrico', 'Bateria', 'Relé']);
  else if (category === 'Bombas') namePrefix = randomItem(["Bomba D'Água", 'Bomba de Óleo', 'Bomba Hidráulica', 'Bomba Injetora']);
  else if (category === 'Embreagem') namePrefix = randomItem(['Kit Embreagem', 'Platô', 'Disco de Embreagem', 'Rolamento', 'Cilindro Mestre']);
  else if (category === 'Juntas/Motor') namePrefix = randomItem(['Junta do Cabeçote', 'Jogo de Juntas', 'Retentor', 'Junta do Cárter']);
  else if (category === 'Iluminação') namePrefix = randomItem(['Farol Principal', 'Lanterna Traseira', 'Pisca Lateral', 'Farol de Milha']);
  else if (category === 'Suspensão') namePrefix = randomItem(['Amortecedor', 'Mola Feixe', 'Bolsa de Ar', 'Pino de Centro']);
  
  const models = ['FH', 'NH', 'Scania Serie 4', 'Scania Serie 5', 'Actros', 'Atego', 'Constellation', 'Delivery', 'Stralis', 'XF', 'TGX'];
  const model = randomItem(models);
  
  const nome = (namePrefix + ' ' + brand + ' ' + model + ' ' + randomNumber(100, 999)).toUpperCase();
  const referencia = 'REF-' + randomNumber(1000, 99999);
  const codigoInterno = 'CI-' + randomNumber(10000, 99999);
  
  // Pad id with zeroes to 3 digits
  let strI = i.toString();
  if(strI.length === 1) strI = '00' + strI;
  if(strI.length === 2) strI = '0' + strI;

  newProducts.push({
    id: 'PROD-' + strI,
    nome,
    referencia,
    codigoInterno,
    preco: randomNumber(50, 4000) + 0.99,
    estoque: randomNumber(0, 50),
    categoria: category,
    marca: brand,
    imagemUrl: null // SEM IMAGEM
  });
}

const dbContent = "import sql from 'mssql';\n\n" +
"// Mock config\n" +
"const sqlConfig = {\n" +
"  user: process.env.SQLSERVER_USER || '',\n" +
"  password: process.env.SQLSERVER_PASSWORD || '',\n" +
"  database: process.env.SQLSERVER_DATABASE || '',\n" +
"  server: process.env.SQLSERVER_SERVER || 'localhost',\n" +
"  port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),\n" +
"  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },\n" +
"  options: { encrypt: false, trustServerCertificate: true }\n" +
"};\n\n" +
"export async function getSqlServerPool(): Promise<any> {\n" +
"  return null;\n" +
"}\n\n" +
"export interface ProdutoSqlServer {\n" +
"  id: string;\n" +
"  nome: string;\n" +
"  referencia: string;\n" +
"  codigoInterno: string;\n" +
"  preco: number | null;\n" +
"  estoque: number;\n" +
"  categoria: string | null;\n" +
"  marca: string | null;\n" +
"  imagemUrl?: string | null;\n" +
"}\n\n" +
"export async function getProdutosSqlServer(): Promise<ProdutoSqlServer[]> {\n" +
"  return " + JSON.stringify(newProducts, null, 2) + ";\n" +
"}\n";

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'db-sqlserver.ts'), dbContent);
console.log('Script gerado com 150 produtos sem imagem!');
