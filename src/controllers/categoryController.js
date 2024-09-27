const category = require("../models/Category");

const getCategory = async (req, res) => {
  try {
    const categoryAll = await category.findAll();
    res.status(200).json(categoryAll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const categorie = req.body;
    await category.create(categorie);
    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategory, createCategory };
