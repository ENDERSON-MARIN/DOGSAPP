# 🧪 Guia de Testes da API

## Como testar a API

### 1. Certifique-se de que o servidor está rodando

Primeiro, inicie o servidor em um terminal:

```bash
npm start
```

O servidor deve estar rodando em `http://localhost:3001`

### 2. Execute os testes

Em outro terminal, execute:

```bash
npm run test:api
```

## O que será testado

### ✅ Rotas de Temperaments

- `GET /api/temperaments` - Buscar todos os temperamentos

### ✅ Rotas de Dogs

- `GET /api/dogs` - Buscar todos os dogs
- `GET /api/dogs?name=labrador` - Buscar dogs por nome
- `GET /api/dogs/:id` - Buscar dog por ID
- `POST /api/dogs` - Criar novo dog
- `PUT /api/dogs/:id` - Atualizar dog
- `DELETE /api/dogs/:id` - Deletar dog

### ✅ Validações

- Teste com parâmetros inválidos
- Teste com dados faltando

## Configuração

Se sua API estiver rodando em outra porta ou URL, você pode configurar no arquivo `.env`:

```env
API_URL=http://localhost:3001/api
```

## Resultado esperado

O script mostrará:

- ✓ Testes que passaram (verde)
- ✗ Testes que falharam (vermelho)
- ℹ Informações sobre cada teste (azul)
- ⚠ Avisos (amarelo)

No final, você verá um resumo com:

- Total de testes executados
- Quantos passaram
- Quantos falharam
- Taxa de sucesso

## Testando manualmente com cURL

Se preferir testar manualmente, aqui estão alguns exemplos:

### Buscar todos os dogs

```bash
curl http://localhost:3001/api/dogs
```

### Buscar dogs por nome

```bash
curl "http://localhost:3001/api/dogs?name=labrador"
```

### Buscar temperamentos

```bash
curl http://localhost:3001/api/temperaments
```

### Criar novo dog

```bash
curl -X POST http://localhost:3001/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dog",
    "height_min": 30,
    "height_max": 40,
    "weight_min": 10,
    "weight_max": 20,
    "years_life": "10-12",
    "image": "https://example.com/dog.jpg",
    "temperaments": ["Friendly", "Active"]
  }'
```

## Testando com Postman ou Insomnia

Você também pode importar as rotas para ferramentas como Postman ou Insomnia:

1. Base URL: `http://localhost:3001/api`
2. Crie requisições para cada endpoint listado acima
3. Configure os headers: `Content-Type: application/json`
4. Para POST/PUT, adicione o body em JSON

## Troubleshooting

### Erro: "Sem resposta do servidor"

- Verifique se o servidor está rodando (`npm start`)
- Verifique se a porta 3001 está disponível
- Verifique o arquivo `.env` se estiver usando outra porta

### Erro: "Cannot find module 'axios'"

- Execute: `npm install` (axios já está no package.json)

### Erro de conexão com banco de dados

- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Verifique se o banco de dados foi criado
