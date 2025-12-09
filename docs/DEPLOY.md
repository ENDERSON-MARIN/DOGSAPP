# 🚀 Guia Rápido de Deploy - Vercel + NeonDB

## ✅ Pré-requisitos

- [ ] Conta no [NeonDB](https://neon.tech/)
- [ ] Conta no [Vercel](https://vercel.com/)
- [ ] Repositório no GitHub
- [ ] API Key do [The Dog API](https://thedogapi.com/)

## 📋 Passo a Passo

### 1️⃣ Configurar NeonDB

1. Acesse [console.neon.tech](https://console.neon.tech/)
2. Crie um novo projeto: `dogs-api`
3. Copie a **Connection String** (formato: `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`)

### 2️⃣ Deploy na Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório do GitHub
3. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=sua_api_key_do_thedogapi
NODE_ENV=production
PORT=3001
```

4. Clique em **Deploy**

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add API_KEY
vercel env add NODE_ENV

# Deploy para produção
vercel --prod
```

### 3️⃣ Testar a API

Após o deploy, teste os endpoints:

```bash
# Substituir YOUR_API_URL pela URL da Vercel
curl https://your-api-url.vercel.app/api/dogs

curl https://your-api-url.vercel.app/api/temperaments
```

## 🔧 Variáveis de Ambiente Necessárias

### Para Vercel (Production)

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=your_dog_api_key
NODE_ENV=production
PORT=3001
```

### Para Development (Local)

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dogs
API_KEY=your_dog_api_key
NODE_ENV=development
PORT=3001
```

## ✨ O que já está configurado

✅ `vercel.json` criado
✅ `db.js` otimizado para NeonDB (SSL, connection pooling)
✅ `package.json` com engines configurados
✅ CORS configurado
✅ Suporte a DATABASE_URL e variáveis individuais

## 🐛 Troubleshooting

### Erro: "Connection timeout"

- Verifique se a connection string do NeonDB está correta
- Certifique-se de que `?sslmode=require` está na URL

### Erro: "SSL connection required"

- Adicione `?sslmode=require` no final da DATABASE_URL
- Verifique se `NODE_ENV=production` está configurado

### Erro: "Too many connections"

- O pool já está otimizado (max: 3 conexões)
- Verifique se não há múltiplas instâncias rodando

## 📚 Recursos

- [Documentação NeonDB](https://neon.tech/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Guia Completo](./docs/VERCEL_DEPLOYMENT.md)
