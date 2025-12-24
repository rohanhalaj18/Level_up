const express = require("express");
const router = express.Router();
const { findColleges } = require("../controllers/collegeFinderController");


// POST /api/college-finder
router.post("/",findColleges);

module.exports = router;
