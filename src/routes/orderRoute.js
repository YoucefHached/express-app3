const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const orderValidationRules = require("../middlewares/validationMiddleware");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, orderController.getOrders);
router.post(
  "/",
  authenticate,
  orderValidationRules,
  orderController.createOrder
);

module.exports = router;
