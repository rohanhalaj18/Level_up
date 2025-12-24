const express = require("express");
const {
  findResources,
  getUserResources,
} = require("../controllers/resourceController");


const router = express.Router();

router.post("/find",findResources);
router.get("/my-resources",getUserResources);

module.exports = router;
