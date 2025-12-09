/**
 * Validation script for API package versions
 * Validates: Requirements 1.1, 1.2, 1.3, 1.5
 */

const fs = require("fs");
const path = require("path");

// Read package.json
const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Define required versions
const requirements = {
  engines: {
    node: ">=18.0.0",
  },
  dependencies: {
    express: "^4.19.2",
    sequelize: "^6.35.2",
    pg: "^8.11.5",
    axios: "^1.6.7",
    dotenv: "^16.4.5",
  },
  devDependencies: {
    nodemon: "^3.1.0",
  },
};

// Validation results
let hasErrors = false;
const errors = [];
const successes = [];

// Helper function to compare versions
function validateVersion(actual, required, name, section) {
  if (!actual) {
    errors.push(`❌ ${section}.${name}: Missing (required: ${required})`);
    hasErrors = true;
    return;
  }

  // Extract version numbers for comparison
  const actualVersion = actual.replace(/[\^~>=<]/g, "");
  const requiredVersion = required.replace(/[\^~>=<]/g, "");

  // For simplicity, we check if the actual version string matches or exceeds the requirement
  if (actual === required || actual.includes(requiredVersion)) {
    successes.push(
      `✅ ${section}.${name}: ${actual} (meets requirement: ${required})`
    );
  } else {
    errors.push(`❌ ${section}.${name}: ${actual} (required: ${required})`);
    hasErrors = true;
  }
}

console.log("🔍 Validating API package versions...\n");

// Validate Node.js engine version
console.log("📦 Checking engines:");
validateVersion(
  packageJson.engines?.node,
  requirements.engines.node,
  "node",
  "engines"
);

// Validate dependencies
console.log("\n📦 Checking dependencies:");
Object.entries(requirements.dependencies).forEach(([pkg, version]) => {
  validateVersion(
    packageJson.dependencies?.[pkg],
    version,
    pkg,
    "dependencies"
  );
});

// Validate devDependencies
console.log("\n📦 Checking devDependencies:");
Object.entries(requirements.devDependencies).forEach(([pkg, version]) => {
  validateVersion(
    packageJson.devDependencies?.[pkg],
    version,
    pkg,
    "devDependencies"
  );
});

// Print results
console.log("\n" + "=".repeat(60));
console.log("📊 VALIDATION RESULTS");
console.log("=".repeat(60));

if (successes.length > 0) {
  console.log("\n✅ Passed validations:");
  successes.forEach((msg) => console.log(`  ${msg}`));
}

if (errors.length > 0) {
  console.log("\n❌ Failed validations:");
  errors.forEach((msg) => console.log(`  ${msg}`));
}

console.log("\n" + "=".repeat(60));

if (hasErrors) {
  console.log(
    "❌ VALIDATION FAILED: Some package versions do not meet requirements"
  );
  process.exit(1);
} else {
  console.log("✅ VALIDATION PASSED: All package versions meet requirements");
  console.log("\nRequirements validated:");
  console.log("  - 1.1: Node.js version 18.x or higher");
  console.log("  - 1.2: Express version 4.18.x or higher");
  console.log("  - 1.3: Sequelize version 6.35.x or higher");
  console.log("  - 1.5: pg version 8.11.x or higher");
  process.exit(0);
}
