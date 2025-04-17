const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ❗️ KHÔNG được lồng `router.get(...)` vào trong `router.post(...)`!

// ✅ Route GET lấy đơn hàng của khách hàng
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId })
      .populate("customer")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy đơn hàng", error: err.message });
  }
});

// ✅ Route POST tạo đơn mới
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;
    const orderCode = await Order.generateOrderCode();

    const newOrder = new Order({
      orderCode,
      customer,
      items,
      totalAmount,
      status: "Pending",
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

module.exports = router;
