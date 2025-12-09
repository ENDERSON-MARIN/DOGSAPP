require("dotenv").config();
const { Sequelize } = require("sequelize");
const pg = require("pg");

const { DATABASE_URL } = process.env;

console.log("\n🔍 Teste Rápido de Conexão com o Banco\n");
console.log(
  "DATABASE_URL:",
  DATABASE_URL ? "✓ Configurada" : "✗ Não encontrada"
);

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL não está configurada no .env");
  process.exit(1);
}

// Teste com diferentes configurações
const configs = [
  {
    name: "Configuração Atual (com retry e timeouts longos)",
    options: {
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
      pool: {
        max: 2,
        min: 0,
        acquire: 10000,
        idle: 0,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        connectTimeout: 10000,
        statement_timeout: 10000,
        query_timeout: 10000,
      },
      retry: {
        max: 3,
      },
    },
  },
  {
    name: "Configuração Simplificada (timeouts curtos)",
    options: {
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
      pool: {
        max: 1,
        min: 0,
        acquire: 5000,
        idle: 0,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  },
];

const testConfig = async (config) => {
  console.log(`\n📊 Testando: ${config.name}`);
  console.log("-".repeat(60));

  const sequelize = new Sequelize(DATABASE_URL, config.options);
  const start = Date.now();

  try {
    await sequelize.authenticate();
    const time = Date.now() - start;
    console.log(`✓ Conexão bem-sucedida em ${time}ms`);

    // Teste de query
    const queryStart = Date.now();
    await sequelize.query("SELECT 1 as test");
    const queryTime = Date.now() - queryStart;
    console.log(`✓ Query executada em ${queryTime}ms`);

    await sequelize.close();
    return { success: true, connectionTime: time, queryTime };
  } catch (error) {
    const time = Date.now() - start;
    console.log(`✗ Falhou após ${time}ms`);
    console.log(`  Erro: ${error.name}`);
    console.log(`  Mensagem: ${error.message}`);
    return { success: false, error: error.name, time };
  }
};

const runTests = async () => {
  const results = [];

  for (const config of configs) {
    const result = await testConfig(config);
    results.push({ config: config.name, ...result });
  }

  console.log("\n" + "=".repeat(60));
  console.log("📈 RESUMO DOS TESTES");
  console.log("=".repeat(60));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.config}`);
    if (result.success) {
      console.log(`   ✓ Sucesso`);
      console.log(`   Conexão: ${result.connectionTime}ms`);
      console.log(`   Query: ${result.queryTime}ms`);
    } else {
      console.log(`   ✗ Falhou: ${result.error}`);
      console.log(`   Tempo até falha: ${result.time}ms`);
    }
  });

  console.log("\n");
  process.exit(0);
};

runTests();
