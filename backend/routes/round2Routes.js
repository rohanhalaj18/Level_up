const express = require("express");
const router = express.Router();
const { runGeminiChecker } = require("../controllers/codeCheck");

router.post("/check-code", runGeminiChecker);

module.exports = router;
