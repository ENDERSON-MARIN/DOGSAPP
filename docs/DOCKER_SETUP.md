# Configuração do Banco de Dados

Este projeto suporta duas opções para o banco de dados PostgreSQL:

## Opção 1: Docker Local (Recomendado para desenvolvimento)

### Pré-requisitos

- Docker e Docker Compose instalados

### Passos

1. **Iniciar o banco de dados:**

```bash
docker-compose up -d
```

2. **Verificar se o container está rodando:**

```bash
docker-compose ps
```

3. **Configurar o arquivo .env:**

```bash
cd api
cp .env.example .env
```

As credenciais padrão já estão configuradas no `.env`:

- DB_USER=postgres
- DB_PASSWORD=postgres
- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=dogs

4. **Instalar dependências e iniciar a API:**

```bash
npm install
npm start
```

### Comandos Úteis

**Parar o banco de dados:**

```bash
docker-compose down
```

**Parar e remover volumes (limpar dados):**

```bash
docker-compose down -v
```

**Ver logs do banco:**

```bash
docker-compose logs -f db
```

**Acessar o PostgreSQL via CLI:**

```bash
docker exec -it dogs-postgres psql -U postgres -d dogs
```

## Opção 2: Banco de Dados na Nuvem (NeonDB, Supabase, etc.)

### NeonDB (Recomendado para Vercel)

1. **Criar conta em [NeonDB](https://neon.tech/)**

2. **Criar um novo projeto e copiar a connection string**

   - Formato: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

3. **Atualizar o arquivo `.env` com a DATABASE_URL:**

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

4. **A conexão funcionará automaticamente!**
   - O código em `db.js` detecta `DATABASE_URL` e configura SSL automaticamente
   - Funciona tanto em development quanto em production (Vercel)

**Vantagens do NeonDB:**

- ✅ Serverless-first (perfeito para Vercel)
- ✅ SSL nativo
- ✅ Connection pooling automático
- ✅ Free tier generoso
- ✅ Baixa latência

### Outras opções na nuvem:

- **Supabase**: https://supabase.com/ (PostgreSQL + Auth + Storage)
- **Railway**: https://railway.app/ (Deploy completo)
- **Render**: https://render.com/ (PostgreSQL gerenciado)
- **ElephantSQL**: https://www.elephantsql.com/ (PostgreSQL especializado)

### Para deploy na Vercel

Veja o guia completo em [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Troubleshooting

### Erro de conexão com o banco

- Verifique se o container está rodando: `docker-compose ps`
- Verifique as credenciais no arquivo `.env`
- Verifique se a porta 5432 não está sendo usada por outro processo

### Banco de dados não inicializa

- Remova os volumes e tente novamente: `docker-compose down -v && docker-compose up -d`

### Erro "relation does not exist"

- O Sequelize criará as tabelas automaticamente na primeira execução
- Certifique-se de que `database.sync({ force: false })` está configurado no `index.js`
