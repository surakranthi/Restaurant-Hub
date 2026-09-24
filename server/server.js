const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Hub API is running",
  });
});

// Backend test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend connection successful",
  });
});

// Food routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });