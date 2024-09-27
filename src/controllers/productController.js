const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const product = require("../models/Product");
const exportExcel = require("../services/exportService");
const sequelize = require("../utils/db");
const logger = require("../utils/logger");
const { error, log } = require("winston");

// GET /products
const getProducts = async (req, res) => {
  try {
    console.log("Request query:", req.query); // Log de la requête

    const {
      categorie,
      sort = "price",
      order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    const options = {
      include: [{ model: Category, where: {} }],
      order: [[sort, order]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    };

    if (categorie) {
      options.include[0].where.nom = categorie;
    }

    const produits = await product.findAndCountAll(options);
    console.log("Produits récupérés:", produits); // Log des produits récupérés

    res.status(200).json({
      totalItems: produits.count,
      totalPages: Math.ceil(produits.count / limit),
      currentPage: parseInt(page),
      produits: produits.rows,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err); // Log de l'erreur
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await product.findAll({
      include: [{ model: category, where: { id: id } }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la sélection des produits par catégorie",
    });
  }
};

// const { body, validationResult } = require('express-validator');

// const createProduct = [
//   body('name').notEmpty().withMessage('Name is required'),
//   body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
//   // Ajoutez d'autres validations ici
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     // Suite de votre logique pour créer un produit
//   }
// ];

const getProduct = async (req, res) => {
  console.log(req.params);
  try {
    // console.log( parseInt(req.params.id, 10));
    let { id } = req.params;
    id = parseInt(id, 10);
    console.log(id);

    // if (!id || isNaN(id)) {
    //   return res.status(400).json({ error: "ID de produit non valide" });
    // }

    const Product = await product.findByPk(id);
    // where: { id: id },
    // include: [Category],

    if (!Product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.status(200).json(Product);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la sélection du produit" });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await product.create(newProduct);
    res.status(201).json({ message: "Produit créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    await product.update(updatedProduct, { where: { id: id } });
    res.status(200).json({ message: "Produit mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await product.destroy({ where: { id: id } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const feedStock = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, quantity } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const Product = await product.findByPk(productId, { transaction });
    if (!Product) {
      logger.error(`Product not found: ${productId}`);
      next(new Error("Product not found"));
    }

    Product.stock += quantity;
    await Product.save({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const exportExcelController = async (req, res) => {
  try {
    const products = await product.findAll();
    const workbook = await exportExcel(products);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

    // Écriture asynchrone du fichier Excel dans la réponse HTTP
    await workbook.xlsx.write(res, { useStyles: true, useSharedStrings: true });
    res.end(); // Terminer la réponse après l'écriture
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  exportExcelController,
  feedStock,
};
