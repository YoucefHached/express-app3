const { check } = require("express-validator");

const orderValidationRules = [
  check("userId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("User ID must be un entier positif"),
  check("productId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Product ID must be un entier positif"),
  check("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be au moins 1"),
];

module.exports = orderValidationRules;
