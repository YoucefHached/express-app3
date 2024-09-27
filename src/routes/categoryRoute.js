const express = require("express");
const router = express.Router();
const {
  getCategory,
  createCategory,
} = require("../controllers/categoryController");

router.get("/", getCategory);
router.post("/", createCategory);

module.exports = router;
