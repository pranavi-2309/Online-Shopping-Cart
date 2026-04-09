const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Add product
router.post("/add", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    console.log("✅ Product added:", product.title);
    res.json({ success: true, product });
  } catch (err) {
    console.error("❌ Product add error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all products
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
