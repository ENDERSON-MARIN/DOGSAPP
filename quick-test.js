const axios = require("axios");

const BASE_URL = "http://localhost:3001/api";

async function quickTest() {
  console.log("🚀 Teste rápido da API\n");

  try {
    // Teste 1: Temperaments
    console.log("1️⃣  Testando GET /temperaments...");
    const tempResponse = await axios.get(`${BASE_URL}/temperaments`);
    console.log(`   ✓ Status: ${tempResponse.status}`);
    console.log(
      `   ✓ Temperamentos encontrados: ${tempResponse.data.length}\n`
    );

    // Teste 2: Dogs
    console.log("2️⃣  Testando GET /dogs...");
    const dogsResponse = await axios.get(`${BASE_URL}/dogs`);
    console.log(`   ✓ Status: ${dogsResponse.status}`);
    console.log(`   ✓ Dogs encontrados: ${dogsResponse.data.length}\n`);

    // Teste 3: Buscar por nome
    console.log("3️⃣  Testando GET /dogs?name=labrador...");
    const searchResponse = await axios.get(`${BASE_URL}/dogs?name=labrador`);
    console.log(`   ✓ Status: ${searchResponse.status}`);
    console.log(`   ✓ Resultados: ${searchResponse.data.length}\n`);

    console.log("✅ Todos os testes básicos passaram!");
    console.log("\n💡 Para testes completos, execute: npm run test:api");
  } catch (error) {
    console.error("❌ Erro:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Dados:", error.response.data);
    } else if (error.request) {
      console.error(
        "   ⚠️  Servidor não respondeu. Certifique-se de que está rodando em",
        BASE_URL
      );
    }
    process.exit(1);
  }
}

quickTest();
