const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  orderNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  items: { type: Array, default: [] },
  address: { type: Object, default: {} },
  paymentMethod: { type: String, default: "" },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: "Placed" },
  deliveryDate: { type: Date },
  canReturn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
