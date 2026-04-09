const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load env from server/.env and fallback to ../.env when present.
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "15mb" }));

// Serve static files from parent directory (frontend files)
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB only when URI is configured.
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.warn("⚠️ MONGO_URI is not set. Running without database connection.");
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));
}

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/order", require("./routes/order"));
app.use("/api/product", require("./routes/product"));
app.use("/api/tryon", require("./routes/tryon"));
app.use("/tryon", require("./routes/tryon"));

// API Health check route
app.get("/api", (req, res) => {
  res.json({ 
    message: "ShopKart Backend API",
    status: "running",
    endpoints: {
      auth: "/api/auth/login",
      orders: "/api/order/create",
      products: "/api/product/add, /api/product/all",
      tryOn: "/api/tryon or /tryon"
    }
  });
});

// Serve frontend for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ShopKart Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});
