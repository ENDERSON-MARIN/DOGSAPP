# Deploy na Vercel com NeonDB

Este guia explica como fazer deploy da API na Vercel usando NeonDB como banco de dados.

## Por que NeonDB funciona perfeitamente com Vercel?

✅ **Serverless-first**: NeonDB é otimizado para ambientes serverless como Vercel
✅ **Connection pooling**: Gerencia conexões automaticamente
✅ **SSL nativo**: Conexões seguras por padrão
✅ **Baixa latência**: Infraestrutura global
✅ **Free tier generoso**: Perfeito para desenvolvimento e projetos pequenos

## Passo 1: Configurar NeonDB

1. **Criar conta em [NeonDB](https://neon.tech/)**

2. **Criar um novo projeto:**

   - Nome: `dogs-api`
   - Região: Escolha a mais próxima dos seus usuários

3. **Copiar a Connection String:**
   - No dashboard do NeonDB, copie a connection string
   - Formato: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

## Passo 2: Preparar o Projeto para Vercel

### 2.1 Criar vercel.json na pasta api

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.2 Atualizar package.json (já está configurado)

Certifique-se de que o `package.json` tem:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Passo 3: Deploy na Vercel

### Opção A: Via CLI

1. **Instalar Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login:**

```bash
vercel login
```

3. **Deploy:**

```bash
cd api
vercel
```

4. **Configurar variáveis de ambiente:**

```bash
vercel env add DATABASE_URL
# Cole a connection string do NeonDB

vercel env add API_KEY
# Cole sua API key do The Dog API

vercel env add CORS_ORIGIN
# Cole a URL do seu frontend (ex: https://seu-app.vercel.app)
```

5. **Deploy para produção:**

```bash
vercel --prod
```

### Opção B: Via Dashboard Vercel

1. **Acessar [vercel.com](https://vercel.com/)**

2. **Importar projeto:**

   - Clique em "Add New Project"
   - Conecte seu repositório GitHub
   - Selecione o repositório do projeto

3. **Configurar o projeto:**

   - **Root Directory**: `api`
   - **Framework Preset**: Other
   - **Build Command**: `npm install` (ou deixe vazio)
   - **Output Directory**: `.` (ou deixe vazio)

4. **Adicionar variáveis de ambiente:**

   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
   API_KEY=sua_api_key_aqui
   CORS_ORIGIN=https://seu-frontend.vercel.app
   NODE_ENV=production
   ```

5. **Deploy!**

## Passo 4: Testar a API

Após o deploy, teste os endpoints:

```bash
# Substituir YOUR_API_URL pela URL da Vercel
curl https://your-api-url.vercel.app/api/dogs

curl https://your-api-url.vercel.app/api/temperaments
```

## Configuração do db.js (já implementada)

O código atual em `api/src/db.js` já está otimizado para Vercel + NeonDB:

```javascript
if (DATABASE_URL) {
  // Usa DATABASE_URL (NeonDB, Vercel)
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  });
}
```

**Características importantes:**

- ✅ SSL habilitado automaticamente em production
- ✅ Connection pooling otimizado para serverless
- ✅ Suporta tanto DATABASE_URL quanto variáveis individuais
- ✅ Funciona em development (Docker) e production (NeonDB)

## Variáveis de Ambiente Necessárias

### Para Vercel (Production)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=your_dog_api_key
CORS_ORIGIN=https://seu-frontend.vercel.app
NODE_ENV=production
```

### Para Development (Local)

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dogs
API_KEY=your_dog_api_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Troubleshooting

### Erro: "Connection timeout"

- Verifique se a connection string do NeonDB está correta
- Certifique-se de que `?sslmode=require` está na URL
- Verifique se o projeto NeonDB está ativo (não suspenso)

### Erro: "SSL connection required"

- Adicione `?sslmode=require` no final da DATABASE_URL
- Verifique se `NODE_ENV=production` está configurado

### Erro: "Too many connections"

- Ajuste o pool de conexões em `db.js`:
  ```javascript
  pool: {
    max: 3,  // Máximo de 3 conexões (ideal para serverless)
    min: 1,
    idle: 10000,
  }
  ```

### Erro de CORS

- Verifique se `CORS_ORIGIN` está configurado com a URL correta do frontend
- Certifique-se de que o middleware CORS está configurado em `app.js`

## Monitoramento

### Logs da Vercel

```bash
vercel logs
```

### Logs do NeonDB

- Acesse o dashboard do NeonDB
- Vá em "Monitoring" para ver queries e performance

## Custos

### NeonDB Free Tier

- ✅ 0.5 GB de storage
- ✅ 100 horas de compute por mês
- ✅ Perfeito para desenvolvimento e projetos pequenos

### Vercel Free Tier

- ✅ 100 GB de bandwidth
- ✅ Serverless function executions ilimitadas
- ✅ Perfeito para a maioria dos projetos

## Próximos Passos

1. ✅ Deploy da API na Vercel
2. ✅ Configurar NeonDB
3. ⬜ Deploy do Frontend na Vercel
4. ⬜ Configurar domínio customizado
5. ⬜ Configurar CI/CD com GitHub Actions

## Recursos Úteis

- [NeonDB Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Sequelize with PostgreSQL](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#postgresql)
