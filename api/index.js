require("dotenv").config();
const app = require("../src/app.js");
const { database } = require("../src/db.js");

// Sincronizar banco de dados apenas uma vez
let dbSynced = false;

const syncDatabase = async () => {
  if (!dbSynced) {
    try {
      await database.sync({ force: false });
      console.log("Database synced successfully");
      dbSynced = true;
    } catch (error) {
      console.error("Error syncing database:", error);
      throw error;
    }
  }
};

// Handler para Vercel Serverless Functions
module.exports = async (req, res) => {
  try {
    await syncDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
