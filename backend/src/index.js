require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Middleware  
  app.use(express.json());
  app.use(cors());

// Routes
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/expense-types', require('./routes/expenseTypes.routes'));
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));