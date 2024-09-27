const Sequelize = require("sequelize");

const sequelize = new Sequelize("express", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

sequelize
  .sync()
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Unable to connect to the database:", err));

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();

module.exports = sequelize;
