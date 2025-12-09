# ✅ Checklist de Deploy - Vercel + NeonDB

## 📝 Antes do Deploy

### 1. NeonDB

- [ ] Criar conta no [NeonDB](https://neon.tech/)
- [ ] Criar projeto `dogs-api`
- [ ] Copiar Connection String
- [ ] Verificar que a string termina com `?sslmode=require`

### 2. The Dog API

- [ ] Obter API Key em [thedogapi.com](https://thedogapi.com/)
- [ ] Testar a API Key localmente

### 3. Repositório GitHub

- [ ] Código commitado no GitHub
- [ ] Arquivo `.env` NÃO está no repositório (verificar .gitignore)
- [ ] Arquivo `vercel.json` está no repositório ✅
- [ ] Arquivo `DEPLOY.md` está no repositório ✅

## 🚀 Durante o Deploy

### 1. Vercel - Configuração Inicial

- [ ] Acessar [vercel.com](https://vercel.com/)
- [ ] Fazer login com GitHub
- [ ] Clicar em "Add New Project"
- [ ] Selecionar o repositório `dogs-api`

### 2. Vercel - Configurações do Projeto

- [ ] **Framework Preset**: Other
- [ ] **Root Directory**: `.` (deixar vazio ou raiz)
- [ ] **Build Command**: deixar vazio
- [ ] **Output Directory**: deixar vazio
- [ ] **Install Command**: `npm install`

### 3. Vercel - Variáveis de Ambiente

Adicionar as seguintes variáveis:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
API_KEY=sua_api_key_do_thedogapi
NODE_ENV=production
PORT=3001
```

- [ ] `DATABASE_URL` adicionada
- [ ] `API_KEY` adicionada
- [ ] `NODE_ENV` adicionada
- [ ] `PORT` adicionada

### 4. Deploy

- [ ] Clicar em "Deploy"
- [ ] Aguardar build finalizar (2-3 minutos)
- [ ] Verificar se não há erros no log

## 🧪 Após o Deploy

### 1. Testar Endpoints

```bash
# Substituir YOUR_API_URL pela URL da Vercel
# Exemplo: https://dogs-api-xxx.vercel.app

# Testar endpoint de dogs
curl https://YOUR_API_URL/api/dogs

# Testar endpoint de temperaments
curl https://YOUR_API_URL/api/temperaments

# Testar endpoint de dog específico
curl https://YOUR_API_URL/api/dogs/1
```

- [ ] Endpoint `/api/dogs` funcionando
- [ ] Endpoint `/api/temperaments` funcionando
- [ ] Endpoint `/api/dogs/:id` funcionando

### 2. Verificar Logs

- [ ] Acessar dashboard da Vercel
- [ ] Verificar logs em "Deployments" > "Functions"
- [ ] Verificar se não há erros

### 3. Verificar NeonDB

- [ ] Acessar dashboard do NeonDB
- [ ] Verificar conexões ativas
- [ ] Verificar se as tabelas foram criadas

## 🔧 Configurações Opcionais

### 1. Domínio Customizado

- [ ] Adicionar domínio customizado na Vercel
- [ ] Configurar DNS
- [ ] Aguardar propagação

### 2. CORS (se tiver frontend)

- [ ] Adicionar variável `CORS_ORIGIN` com URL do frontend
- [ ] Atualizar código do CORS em `src/app.js` se necessário

### 3. Monitoramento

- [ ] Configurar alertas na Vercel
- [ ] Configurar monitoramento no NeonDB

## 🐛 Troubleshooting

### Se o deploy falhar:

1. **Verificar logs da Vercel**

   - Acessar "Deployments" > Último deploy > "View Function Logs"

2. **Verificar variáveis de ambiente**

   - Settings > Environment Variables
   - Verificar se todas estão corretas

3. **Verificar NeonDB**

   - Verificar se o projeto está ativo
   - Verificar se a connection string está correta

4. **Testar localmente**
   ```bash
   # Usar as mesmas variáveis de ambiente da Vercel
   DATABASE_URL=postgresql://... npm start
   ```

### Erros Comuns:

❌ **"Connection timeout"**

- Verificar connection string do NeonDB
- Adicionar `?sslmode=require` na URL

❌ **"SSL connection required"**

- Verificar se `NODE_ENV=production`
- Verificar se `?sslmode=require` está na URL

❌ **"Module not found"**

- Verificar se todas as dependências estão no `package.json`
- Fazer redeploy

## 📊 Status Final

- [ ] ✅ Deploy concluído com sucesso
- [ ] ✅ Todos os endpoints funcionando
- [ ] ✅ Sem erros nos logs
- [ ] ✅ Banco de dados conectado
- [ ] ✅ URL da API anotada: `_______________________`

## 🎉 Próximos Passos

- [ ] Documentar URL da API
- [ ] Atualizar frontend com nova URL
- [ ] Configurar CI/CD (opcional)
- [ ] Adicionar testes automatizados (opcional)
- [ ] Configurar domínio customizado (opcional)

---

**URL da API:** `https://_____________________.vercel.app`

**Data do Deploy:** `___/___/______`

**Versão:** `1.0.0`
