# Ribeiro Auto Peças

Site em Next.js para vitrine de peças automotivas com catálogo carregado do SQL Server ou do inventário importado do PDF.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Configuração de lançamento

Copie `.env.example` para `.env.local` e ajuste os dados públicos antes de publicar:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5571987929619
NEXT_PUBLIC_WHATSAPP_DISPLAY="(71) 98792-9619"
NEXT_PUBLIC_STORE_EMAIL=ribeiroautopecas.financeiro@gmail.com
NEXT_PUBLIC_STORE_ADDRESS="Salvador, BA"
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` deve ficar só com DDI, DDD e número, sem espaços. O carrinho monta a mensagem do pedido com nome, forma de pagamento, entrega ou retirada, endereço e itens selecionados.

## Conexão com SQL Server

1. Copie `.env.example` para `.env.local`.
2. Preencha os dados do SQL Server local:

```env
SQLSERVER_SERVER=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=RibeiroAutoPecas
SQLSERVER_USER=site_user
SQLSERVER_PASSWORD=sua_senha
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true
```

3. Crie no SQL Server uma view chamada `dbo.VW_SITE_PRODUTOS` expondo os campos que o site espera:

```sql
CREATE OR ALTER VIEW dbo.VW_SITE_PRODUTOS AS
SELECT
  CAST(P.Codigo AS nvarchar(100)) AS id,
  CAST(P.Nome AS nvarchar(255)) AS nome,
  CAST(P.Referencia AS nvarchar(100)) AS referencia,
  CAST(P.CodigoInterno AS nvarchar(100)) AS codigoInterno,
  CAST(P.PrecoVenda AS decimal(18, 2)) AS preco,
  CAST(P.EstoqueAtual AS int) AS estoque,
  CAST(C.Nome AS nvarchar(120)) AS categoria,
  CAST(M.Nome AS nvarchar(120)) AS marca,
  CAST(P.Ncm AS nvarchar(40)) AS ncm,
  CAST(P.Unidade AS nvarchar(20)) AS unidade,
  CAST(P.ImagemUrl AS nvarchar(500)) AS imagemUrl,
  CAST(1 AS bit) AS visivel
FROM dbo.Produtos P
LEFT JOIN dbo.Categorias C ON C.Id = P.CategoriaId
LEFT JOIN dbo.Marcas M ON M.Id = P.MarcaId;
```

Ajuste os nomes das tabelas e colunas (`Produtos`, `Categorias`, `Marcas`, etc.) para bater com o banco real desse computador.

Por padrao o site executa:

```sql
SELECT TOP (@limit) ... FROM dbo.VW_SITE_PRODUTOS WHERE ISNULL(visivel, 1) = 1 ORDER BY nome
```

Se você preferir não criar a view, defina `SQLSERVER_PRODUCTS_QUERY` no `.env.local` com uma query própria. Ela deve retornar pelo menos `id` e `nome`; os outros campos podem ser `referencia`, `codigoInterno`, `preco`, `estoque`, `categoria`, `marca`, `ncm`, `unidade` e `imagemUrl`.

> Observação: a lib `mssql` configurada aqui usa login e senha do SQL Server. Se o servidor estiver apenas com autenticação Windows, habilite autenticação mista no SQL Server ou troque a estratégia para um driver com suporte a Windows Auth.
