const sequelize = require("../utils/db");
const { DataTypes } = require("sequelize");
// const Product = require("./Product");

const Category = sequelize.define("Categories", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Category.hasMany(Product, { foreignKey: "categoryId" });

module.exports = Category;
