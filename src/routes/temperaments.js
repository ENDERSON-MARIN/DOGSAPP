const { Router } = require("express");

const { getAllDogsTemperaments } = require("../controllers/temperaments");

const router = Router();

router.get("/", getAllDogsTemperaments);

module.exports = router;
