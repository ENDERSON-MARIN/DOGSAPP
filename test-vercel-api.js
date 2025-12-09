/**
 * Script para testar a API após deploy na Vercel
 *
 * Uso:
 * node test-vercel-api.js https://sua-api.vercel.app
 */

const axios = require("axios");

const API_URL = process.argv[2] || "http://localhost:3001";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await axios.get(url);

    if (response.status === expectedStatus) {
      log.success(`${name}: ${response.status}`);
      return { success: true, data: response.data };
    } else {
      log.warning(
        `${name}: Status ${response.status} (esperado ${expectedStatus})`
      );
      return { success: false, status: response.status };
    }
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("\n" + "=".repeat(50));
  log.info(`Testando API: ${API_URL}`);
  console.log("=".repeat(50) + "\n");

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Test 1: GET /api/dogs
  console.log("1. Testando GET /api/dogs");
  const dogsResult = await testEndpoint("GET /api/dogs", `${API_URL}/api/dogs`);
  results.total++;
  if (dogsResult.success) {
    results.passed++;
    log.info(`   Total de dogs: ${dogsResult.data.length || 0}`);
  } else {
    results.failed++;
  }
  console.log();

  // Test 2: GET /api/temperaments
  console.log("2. Testando GET /api/temperaments");
  const temperamentsResult = await testEndpoint(
    "GET /api/temperaments",
    `${API_URL}/api/temperaments`
  );
  results.total++;
  if (temperamentsResult.success) {
    results.passed++;
    log.info(
      `   Total de temperaments: ${temperamentsResult.data.length || 0}`
    );
  } else {
    results.failed++;
  }
  console.log();

  // Test 3: GET /api/dogs/:id (usando ID 1)
  console.log("3. Testando GET /api/dogs/:id");
  const dogByIdResult = await testEndpoint(
    "GET /api/dogs/1",
    `${API_URL}/api/dogs/1`
  );
  results.total++;
  if (dogByIdResult.success) {
    results.passed++;
    if (dogByIdResult.data) {
      log.info(`   Dog encontrado: ${dogByIdResult.data.name || "N/A"}`);
    }
  } else {
    results.failed++;
  }
  console.log();

  // Test 4: GET /api/dogs?name=golden (busca por nome)
  console.log("4. Testando GET /api/dogs?name=golden");
  const dogsByNameResult = await testEndpoint(
    "GET /api/dogs?name=golden",
    `${API_URL}/api/dogs?name=golden`
  );
  results.total++;
  if (dogsByNameResult.success) {
    results.passed++;
    log.info(`   Dogs encontrados: ${dogsByNameResult.data.length || 0}`);
  } else {
    results.failed++;
  }
  console.log();

  // Resumo
  console.log("=".repeat(50));
  console.log("RESUMO DOS TESTES");
  console.log("=".repeat(50));
  console.log(`Total de testes: ${results.total}`);
  log.success(`Passou: ${results.passed}`);
  if (results.failed > 0) {
    log.error(`Falhou: ${results.failed}`);
  }
  console.log("=".repeat(50) + "\n");

  if (results.failed === 0) {
    log.success("🎉 Todos os testes passaram!");
  } else {
    log.error("❌ Alguns testes falharam. Verifique os logs acima.");
  }
}

// Executar testes
if (!process.argv[2]) {
  log.warning("URL da API não fornecida. Usando http://localhost:3001");
  log.info("Uso: node test-vercel-api.js https://sua-api.vercel.app");
  console.log();
}

runTests().catch((error) => {
  log.error(`Erro ao executar testes: ${error.message}`);
  process.exit(1);
});
