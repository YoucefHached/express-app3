const express = require("express");
// const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const error = require("./src/middlewares/errorHandler");
const categoryRoutes = require("./src/routes/categoryRoute");
const productRoutes = require("./src/routes/productRoute");
const userRoutes = require("./src/routes/userRoute");
const orderRoutes = require("./src/routes/orderRoute");
const limiter = require("./src/middlewares/rateLimiter");

const app = express();

dotenv.config();

app.use(helmet());

app.use(morgan("combined"));

app.use(express.json());

app.use(limiter);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);

app.use(error);

// sequelize
//   .sync({ force: false }) // 'force: false' permet de ne pas écraser les tables existantes
//   .then(() => {
//     console.log("Tables and relationships are synchronized");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing the database:", error);
//   });

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
