require("dotenv").config();
const { database } = require("../src/db.js");

// Cores para output no terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

const testDatabasePerformance = async () => {
  console.log("\n" + "=".repeat(60));
  log(colors.cyan, "🔍 TESTE DE DESEMPENHO DO BANCO DE DADOS");
  console.log("=".repeat(60) + "\n");

  const results = {
    connection: null,
    authentication: null,
    simpleQuery: null,
    modelQuery: null,
    total: null,
  };

  const startTotal = Date.now();

  try {
    // Teste 1: Tempo de conexão inicial
    log(colors.blue, "📡 Teste 1: Conexão Inicial");
    const startConnection = Date.now();
    await database.authenticate();
    results.connection = Date.now() - startConnection;
    log(colors.green, `✓ Conexão estabelecida em ${results.connection}ms\n`);

    // Teste 2: Query SQL simples
    log(colors.blue, "📊 Teste 2: Query SQL Simples (SELECT 1)");
    const startSimpleQuery = Date.now();
    await database.query("SELECT 1 as test");
    results.simpleQuery = Date.now() - startSimpleQuery;
    log(colors.green, `✓ Query executada em ${results.simpleQuery}ms\n`);

    // Teste 3: Query com modelo (se existir dados)
    log(colors.blue, "📊 Teste 3: Query com Modelo (Dog.findAll)");
    const { Dog } = require("../src/db.js");
    const startModelQuery = Date.now();
    const dogs = await Dog.findAll({ limit: 5 });
    results.modelQuery = Date.now() - startModelQuery;
    log(colors.green, `✓ Query de modelo executada em ${results.modelQuery}ms`);
    log(colors.cyan, `  Registros encontrados: ${dogs.length}\n`);

    // Teste 4: Múltiplas queries consecutivas
    log(colors.blue, "🔄 Teste 4: 5 Queries Consecutivas");
    const consecutiveResults = [];
    for (let i = 1; i <= 5; i++) {
      const start = Date.now();
      await database.query("SELECT 1");
      const time = Date.now() - start;
      consecutiveResults.push(time);
      log(colors.cyan, `  Query ${i}: ${time}ms`);
    }
    const avgConsecutive =
      consecutiveResults.reduce((a, b) => a + b, 0) / consecutiveResults.length;
    log(colors.green, `✓ Média: ${avgConsecutive.toFixed(2)}ms\n`);

    // Teste 5: Pool de conexões
    log(colors.blue, "🏊 Teste 5: Informações do Pool de Conexões");
    const poolInfo = database.connectionManager.pool;
    if (poolInfo) {
      log(colors.cyan, `  Max conexões: ${poolInfo._maxSize || "N/A"}`);
      log(colors.cyan, `  Min conexões: ${poolInfo._minSize || "N/A"}`);
      log(
        colors.cyan,
        `  Conexões ativas: ${poolInfo._inUseObjects?.length || 0}`
      );
      log(
        colors.cyan,
        `  Conexões disponíveis: ${poolInfo._availableObjects?.length || 0}\n`
      );
    }

    results.total = Date.now() - startTotal;

    // Resumo
    console.log("=".repeat(60));
    log(colors.cyan, "📈 RESUMO DOS RESULTADOS");
    console.log("=".repeat(60));
    log(colors.green, `✓ Conexão Inicial: ${results.connection}ms`);
    log(colors.green, `✓ Query Simples: ${results.simpleQuery}ms`);
    log(colors.green, `✓ Query com Modelo: ${results.modelQuery}ms`);
    log(colors.green, `✓ Tempo Total: ${results.total}ms`);
    console.log("=".repeat(60) + "\n");

    // Análise de desempenho
    log(colors.cyan, "💡 ANÁLISE:");
    if (results.connection > 3000) {
      log(
        colors.red,
        "⚠️  ALERTA: Conexão inicial muito lenta (>3s) - pode causar timeout no Vercel"
      );
    } else if (results.connection > 1000) {
      log(
        colors.yellow,
        "⚠️  ATENÇÃO: Conexão inicial lenta (>1s) - próximo do limite"
      );
    } else {
      log(colors.green, "✓ Conexão inicial rápida (<1s)");
    }

    if (results.simpleQuery > 1000) {
      log(
        colors.red,
        "⚠️  ALERTA: Queries muito lentas - verifique a latência do banco"
      );
    } else if (results.simpleQuery > 500) {
      log(colors.yellow, "⚠️  ATENÇÃO: Queries um pouco lentas");
    } else {
      log(colors.green, "✓ Queries rápidas");
    }

    if (results.total > 10000) {
      log(colors.red, "⚠️  ALERTA: Tempo total excede limite do Vercel (10s)");
    } else {
      log(colors.green, "✓ Tempo total dentro do limite do Vercel");
    }

    console.log("\n");

    // Fechar conexão
    await database.close();
    log(colors.green, "✓ Conexão fechada com sucesso");

    process.exit(0);
  } catch (error) {
    log(colors.red, "\n❌ ERRO NO TESTE:");
    console.error(error);

    if (error.name === "SequelizeConnectionAcquireTimeoutError") {
      log(
        colors.yellow,
        "\n💡 DICA: Timeout ao adquirir conexão. Possíveis causas:"
      );
      log(colors.cyan, "  1. Banco de dados está offline ou inacessível");
      log(colors.cyan, "  2. Credenciais incorretas");
      log(colors.cyan, "  3. Firewall bloqueando a conexão");
      log(colors.cyan, "  4. SSL/TLS mal configurado");
      log(
        colors.cyan,
        "  5. DATABASE_URL com parâmetros incompatíveis (ex: channel_binding)"
      );
    }

    process.exit(1);
  }
};

// Executar teste
testDatabasePerformance();
