const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create order
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      orderNumber,
      date,
      items,
      address,
      paymentMethod,
      subtotal,
      discount,
      total,
      status,
      deliveryDate,
      canReturn
    } = req.body;

    if (!userId || !orderNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "userId, orderNumber and at least one item are required"
      });
    }

    const order = await Order.create({
      userId,
      orderNumber,
      date,
      items,
      address,
      paymentMethod,
      subtotal,
      discount,
      total,
      totalAmount: total,
      status,
      deliveryDate,
      canReturn
    });
    console.log("✅ Order created:", order._id);
    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all orders for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
