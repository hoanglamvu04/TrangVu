const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Notification = require("../models/Notification");

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
    const { customer, items, totalAmount, status, address } = req.body;
    const orderCode = await Order.generateOrderCode();

    const newOrder = new Order({
      orderCode,
      customer,
      items,
      totalAmount,
      status: status || "Pending",
      address,
    });

    const saved = await newOrder.save();

    // ✅ Gửi thông báo khi tạo đơn hàng mới
    await Notification.create({
      customerId: customer,
      orderCode,
      type: "placed",
      message: `Đơn hàng ${orderCode} đã được đặt thành công với tổng tiền ${totalAmount.toLocaleString("vi-VN")} ₫.`,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

// ✅ PUT update order status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (updated) {
      // ✅ Gửi thông báo tương ứng với trạng thái đơn hàng
      const statusMap = {
        Pending: { type: "placed", text: "đã được đặt" },
        Processing: { type: "confirmed", text: "đã được xác nhận" },
        Shipped: { type: "shipping", text: "đang được giao" },
        Delivered: { type: "delivered", text: "đã giao thành công" },
        Cancelled: { type: "cancelled", text: "đã bị huỷ" },
      };

      const statusInfo = statusMap[status] || { type: "updated", text: "đã cập nhật" };

      await Notification.create({
        customerId: updated.customer,
        orderCode: updated.orderCode,
        type: statusInfo.type,
        message: `Đơn hàng ${updated.orderCode} ${statusInfo.text}.`,
      });
    }

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
