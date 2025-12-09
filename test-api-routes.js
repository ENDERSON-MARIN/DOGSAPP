const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.API_URL || "http://localhost:3001/api";

// Cores para o console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) =>
    console.log(
      `\n${colors.blue}${"=".repeat(50)}${colors.reset}\n${msg}\n${
        colors.blue
      }${"=".repeat(50)}${colors.reset}`
    ),
};

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

async function testRoute(
  method,
  endpoint,
  data = null,
  expectedStatus = 200,
  description = ""
) {
  testResults.total++;
  const url = `${BASE_URL}${endpoint}`;

  try {
    log.info(`Testando: ${method.toUpperCase()} ${endpoint}`);
    if (description) log.info(`Descrição: ${description}`);

    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await axios.get(url);
        break;
      case "post":
        response = await axios.post(url, data);
        break;
      case "put":
        response = await axios.put(url, data);
        break;
      case "delete":
        response = await axios.delete(url);
        break;
      default:
        throw new Error(`Método ${method} não suportado`);
    }

    if (response.status === expectedStatus) {
      log.success(`Status: ${response.status} - OK`);
      log.info(
        `Resposta: ${JSON.stringify(response.data).substring(0, 100)}...`
      );
      testResults.passed++;
      return response.data;
    } else {
      log.warning(
        `Status esperado: ${expectedStatus}, recebido: ${response.status}`
      );
      testResults.failed++;
      return null;
    }
  } catch (error) {
    if (error.response) {
      log.error(
        `Erro ${error.response.status}: ${
          error.response.data.message || error.response.statusText
        }`
      );
      log.error(`Detalhes: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      log.error("Erro: Sem resposta do servidor");
      log.error("Verifique se o servidor está rodando");
    } else {
      log.error(`Erro: ${error.message}`);
    }
    testResults.failed++;
    return null;
  }
  console.log("");
}

async function runTests() {
  log.section("🧪 INICIANDO TESTES DA API - DOGS");
  log.info(`Base URL: ${BASE_URL}\n`);

  // ========== TESTES DE TEMPERAMENTS ==========
  log.section("📋 TESTANDO ROTAS DE TEMPERAMENTS");

  await testRoute(
    "GET",
    "/temperaments",
    null,
    200,
    "Buscar todos os temperamentos"
  );

  // ========== TESTES DE DOGS ==========
  log.section("🐕 TESTANDO ROTAS DE DOGS");

  // GET todos os dogs
  const allDogs = await testRoute(
    "GET",
    "/dogs",
    null,
    200,
    "Buscar todos os dogs"
  );

  // GET dogs por nome
  await testRoute(
    "GET",
    "/dogs?name=labrador",
    null,
    200,
    'Buscar dogs pelo nome "labrador"'
  );

  // GET dog por ID (usando um ID da API se existir)
  if (allDogs && allDogs.length > 0) {
    const firstDogId = allDogs[0].id;
    await testRoute(
      "GET",
      `/dogs/${firstDogId}`,
      null,
      200,
      `Buscar dog por ID: ${firstDogId}`
    );
  }

  // POST - Criar novo dog
  const newDog = {
    name: "Test Dog API",
    height_min: 30,
    height_max: 40,
    weight_min: 10,
    weight_max: 20,
    years_life: "10-12",
    image: "https://example.com/dog.jpg",
    temperaments: ["Friendly", "Active"],
  };

  const createdDog = await testRoute(
    "POST",
    "/dogs",
    newDog,
    200,
    "Criar novo dog"
  );

  // PUT - Atualizar dog (se foi criado)
  if (createdDog && createdDog.id) {
    const updatedData = {
      ...newDog,
      name: "Test Dog API Updated",
    };

    await testRoute(
      "PUT",
      `/dogs/${createdDog.id}`,
      updatedData,
      200,
      `Atualizar dog ID: ${createdDog.id}`
    );

    // DELETE - Deletar dog criado
    await testRoute(
      "DELETE",
      `/dogs/${createdDog.id}`,
      null,
      200,
      `Deletar dog ID: ${createdDog.id}`
    );
  }

  // ========== TESTES DE VALIDAÇÃO ==========
  log.section("🔍 TESTANDO VALIDAÇÕES");

  // Teste com nome inválido (números)
  await testRoute(
    "GET",
    "/dogs?name=123",
    null,
    400,
    "Buscar com nome inválido (deve falhar)"
  );

  // Teste criar dog sem dados obrigatórios
  await testRoute(
    "POST",
    "/dogs",
    { name: "Test" },
    400,
    "Criar dog sem dados obrigatórios (deve falhar)"
  );

  // ========== RESUMO ==========
  log.section("📊 RESUMO DOS TESTES");
  console.log(`Total de testes: ${testResults.total}`);
  console.log(`${colors.green}Passou: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Falhou: ${testResults.failed}${colors.reset}`);
  console.log(
    `Taxa de sucesso: ${(
      (testResults.passed / testResults.total) *
      100
    ).toFixed(2)}%\n`
  );

  if (testResults.failed === 0) {
    log.success("🎉 Todos os testes passaram!");
  } else {
    log.warning("⚠️  Alguns testes falharam. Verifique os logs acima.");
  }
}

// Executar os testes
runTests().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  process.exit(1);
});
