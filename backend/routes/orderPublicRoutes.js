const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// Lấy danh sách đơn của khách hàng
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

    // Tạo đơn hàng mới
    const newOrder = new Order({
      orderCode,
      customer,
      items,
      totalAmount,
      address,
    });

    // Lưu đơn hàng vào DB
    const savedOrder = await newOrder.save();

    // Tạo thông báo cho khách hàng
    await Notification.create({
      customerId: customer,
      orderCode,
      message: `Bạn đã đặt đơn hàng ${orderCode} thành công với tổng tiền ${totalAmount.toLocaleString("vi-VN")} ₫.`,
    });

    // Trả về đơn hàng đã lưu
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

// Cập nhật trạng thái đơn hàng
router.put("/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái", error: err.message });
  }
});

module.exports = router;
