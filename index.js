const express = require("express");

const connectDB = require("./utils/connectDB.js");

const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoute.js");
const productRoutes = require("./routes/productRoute.js");

const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
