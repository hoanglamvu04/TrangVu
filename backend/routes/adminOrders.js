const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("customer").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error: err.message });
  }
});

// ✅ POST new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount, status } = req.body;
    const orderCode = await Order.generateOrderCode();

    const newOrder = new Order({
      orderCode,
      customer,
      items,
      totalAmount,
      status,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

// ✅ PUT update order status
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật đơn hàng", error: err.message });
  }
});

// ✅ DELETE order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá đơn hàng", error: err.message });
  }
});

module.exports = router;
