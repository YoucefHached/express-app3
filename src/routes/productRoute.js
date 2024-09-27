const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const orderValidationRules = require("../middlewares/validationMiddleware");

router.get("/export", productController.exportExcelController);
router.get("/", productController.getProducts);
router.get("/category/:id", productController.getProductsByCategory);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.post("/feed", orderValidationRules, productController.feedStock);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
