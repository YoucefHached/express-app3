const sequelize = require("../utils/db");
// const { User, Product, Order } = require("../models");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation errors", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId, quantity } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      logger.error(`User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      logger.error(`Product not found: ${productId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      logger.warn(`Insufficient stock for product ${productId}`);
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const order = await Order.create(
      { userId, productId, quantity },
      { transaction }
    );

    product.stock -= quantity;
    await product.save({ transaction });

    if (product.stock < 5) {
      logger.warn(`Low stock for product: ${product.name}`);
    }

    await transaction.commit();

    logger.info(`Order created successfully: ${order.id}`);
    return res.status(201).json(order);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating order: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createOrder = async (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const product = await Product.findByPk(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product.stock < quantity) {
//       return res.status(400).json({ message: "Insufficient stock" });
//     }

//     const order = await Order.create({ userId, productId, quantity });

//     product.stock -= quantity;
//     await product.save();

//     if (product.stock < 5) {
//       console.warn(`Low stock for product: ${product.name}`);
//     }

//     return res.status(201).json(order);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

module.exports = { createOrder, getOrders };
