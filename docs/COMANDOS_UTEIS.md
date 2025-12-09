# 🛠️ Comandos Úteis - Deploy Vercel

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Instalar Vercel CLI globalmente
npm install -g vercel
```

## 🚀 Deploy

```bash
# Login na Vercel
vercel login

# Deploy (preview)
vercel

# Deploy para produção
vercel --prod

# Ver logs do último deploy
vercel logs

# Ver logs em tempo real
vercel logs --follow
```

## 🔧 Variáveis de Ambiente

```bash
# Adicionar variável de ambiente
vercel env add DATABASE_URL

# Listar variáveis de ambiente
vercel env ls

# Remover variável de ambiente
vercel env rm DATABASE_URL

# Puxar variáveis de ambiente para .env.local
vercel env pull
```

## 🧪 Testes

```bash
# Testar API local
npm run test:api

# Testar API na Vercel (após deploy)
npm run test:vercel https://sua-api.vercel.app

# Testar endpoint específico
curl https://sua-api.vercel.app/api/dogs

# Testar com query params
curl "https://sua-api.vercel.app/api/dogs?name=golden"

# Testar POST (criar dog)
curl -X POST https://sua-api.vercel.app/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dog",
    "height": "30 - 40",
    "weight": "10 - 15",
    "life_span": "10 - 12 years",
    "image": "https://example.com/dog.jpg",
    "temperaments": ["Friendly", "Active"]
  }'
```

## 🗄️ NeonDB

```bash
# Conectar ao banco via psql (se tiver instalado)
psql "postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Ver tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM "Dogs" LIMIT 10;

# Sair do psql
\q
```

## 📊 Monitoramento

```bash
# Ver status do projeto
vercel inspect

# Ver lista de deploys
vercel ls

# Ver detalhes de um deploy específico
vercel inspect [deployment-url]

# Cancelar deploy em andamento
vercel cancel
```

## 🔄 Redeploy

```bash
# Redeploy do último commit
vercel --prod

# Redeploy forçado (limpa cache)
vercel --prod --force

# Redeploy de um deploy específico
vercel redeploy [deployment-url] --prod
```

## 🌐 Domínio

```bash
# Adicionar domínio customizado
vercel domains add seu-dominio.com

# Listar domínios
vercel domains ls

# Remover domínio
vercel domains rm seu-dominio.com
```

## 🐛 Debug

```bash
# Ver logs de erro
vercel logs --since 1h

# Ver logs de uma função específica
vercel logs --function api/dogs

# Ver logs com filtro
vercel logs --filter "error"

# Baixar logs
vercel logs > logs.txt
```

## 🔐 Secrets (Variáveis Sensíveis)

```bash
# Adicionar secret
vercel secrets add database-url "postgresql://..."

# Listar secrets
vercel secrets ls

# Remover secret
vercel secrets rm database-url

# Usar secret em variável de ambiente
# No dashboard: @database-url
```

## 📝 Informações do Projeto

```bash
# Ver informações do projeto
vercel project ls

# Ver configuração atual
cat vercel.json

# Ver variáveis de ambiente locais
cat .env
```

## 🔄 Git

```bash
# Commit e push (trigger auto-deploy se configurado)
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin main

# Ver status
git status

# Ver histórico
git log --oneline
```

## 🧹 Limpeza

```bash
# Remover node_modules
rm -rf node_modules

# Reinstalar dependências
npm install

# Limpar cache do npm
npm cache clean --force

# Remover projeto da Vercel (cuidado!)
vercel remove [project-name]
```

## 📱 Atalhos Úteis

```bash
# Abrir dashboard da Vercel no browser
vercel open

# Abrir último deploy no browser
vercel inspect --open

# Copiar URL do último deploy
vercel ls --json | jq -r '.[0].url' | pbcopy  # macOS
vercel ls --json | jq -r '.[0].url' | clip    # Windows
```

## 🔍 Verificações Rápidas

```bash
# Verificar se a API está online
curl -I https://sua-api.vercel.app/api/dogs

# Verificar tempo de resposta
time curl https://sua-api.vercel.app/api/dogs

# Verificar headers
curl -v https://sua-api.vercel.app/api/dogs

# Verificar CORS
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  https://sua-api.vercel.app/api/dogs
```

## 📚 Links Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Dashboard NeonDB: https://console.neon.tech/
- Documentação Vercel: https://vercel.com/docs
- Documentação NeonDB: https://neon.tech/docs
- The Dog API: https://thedogapi.com/

## 💡 Dicas

1. **Sempre teste localmente antes de fazer deploy**

   ```bash
   npm start
   npm run test:api
   ```

2. **Use variáveis de ambiente para secrets**

   - Nunca commite `.env` no Git
   - Use `vercel env add` para adicionar secrets

3. **Monitore os logs após deploy**

   ```bash
   vercel logs --follow
   ```

4. **Configure auto-deploy no GitHub**

   - Vercel > Settings > Git > Enable Auto Deploy

5. **Use preview deployments para testar**
   - Cada PR cria um preview deployment automático
