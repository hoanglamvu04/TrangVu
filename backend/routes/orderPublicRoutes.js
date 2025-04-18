const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// Lấy danh sách đơn của khách
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy đơn hàng", error: err.message });
  }
});

// Đặt hàng mới
router.post("/", async (req, res) => {
  try {
    const { customer, items, totalAmount, address } = req.body;
    const orderCode = await Order.generateOrderCode();

    const newOrder = new Order({
      orderCode,
      customer,
      items,
      totalAmount,
      address,
    });

    const saved = await newOrder.save();

    await Notification.create({
      customerId: customer,
      orderCode,
      message: `Bạn đã đặt đơn hàng ${orderCode} thành công với tổng tiền ${totalAmount.toLocaleString("vi-VN")} ₫.`,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

module.exports = router;
