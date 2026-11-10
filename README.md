# Laboratório NoSQL — API de produtos (MongoDB Atlas)

O objetivo nesse projeto é montar um relatório de vendas a partir dos produtos estruturados em um banco de dados MongoDB.

## Preparação antes da aula

1. Instale Node.js 20 ou superior e tenha acesso à internet.
2. No MongoDB Atlas, crie uma conta e um cluster compatível com seu plano (gratuito, se disponível).
3. Em **Database Access**, crie um usuário de banco com permissões apropriadas ao banco de laboratório.
4. Em **Network Access**, autorize o IP público usado no laboratório; evite liberar todas as origens permanentemente.
5. Em **Connect → Drivers**, copie a URI de conexão, substitua usuário e senha (codifique caracteres especiais da senha na URI).
6. Copie `.env.example` para `.env` e substitua `MONGODB_URI` pela sua URI. Não publique `.env`.

## Executar

```bash
npm install
npm run seed
npm run dev
```

Teste `GET http://localhost:3000/api/health` e `GET http://localhost:3000/api/produtos`. Use `requests.http` no Postman.

## Endpoints prontos

- `GET /api/health` — status da conexão
- `GET /api/produtos` — lista
- `GET /api/produtos/:id` — detalhe
- `POST /api/produtos` — criação
- `PUT /api/produtos/:id` — atualização
- `DELETE /api/produtos/:id` — exclusão

## Desafio: vendas e relatórios

Crie `Venda.js`, controller e rotas de vendas. Cada venda contém cliente, data e itens incorporados. Cada item contém `produto` (ObjectId com `ref: 'Produto'`), quantidade e `precoUnitario` (preço histórico). Na criação, o servidor deve buscar os produtos, validar quantidades e copiar os preços atuais do catálogo; não confiar no preço enviado pelo cliente.

- `POST /api/vendas` — registrar venda
- `GET /api/vendas` — consultar com `.populate('itens.produto')`
- `GET /api/relatorios/vendas` — consolidar em JavaScript: total de vendas, faturamento e unidades vendidas, usando **precoUnitario da venda**, não o preço atual do produto.

Para esta aula, o controle de estoque e transações multi-documento ficam fora do escopo. Em produção, é preciso tratar concorrência, autenticação, integridade e políticas de exclusão de produtos já vendidos.

## Roteiro sugerido (100 min)

- 20 min: slides conceituais
- 15 min: explorar API pronta e testar Atlas
- 35 min: modelar e criar vendas
- 20 min: relatório consolidado
- 10 min: discussão sobre preço histórico
