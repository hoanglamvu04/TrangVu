const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// 🔹 Lấy tất cả thông báo theo customerId
router.get("/:customerId", async (req, res) => {
  try {
    const notifications = await Notification.find({ customerId: req.params.customerId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Tạo mới 1 thông báo
router.post("/", async (req, res) => {
  try {
    const { customerId, message, type, orderCode } = req.body;
    const notification = new Notification({ customerId, message, type, orderCode });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Đánh dấu đã đọc
router.patch("/read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { status: "read" });
    res.json({ message: "Đã đánh dấu đã đọc" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Xoá 1 thông báo
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá thông báo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Xoá tất cả thông báo của khách hàng
router.delete("/all/:customerId", async (req, res) => {
  try {
    await Notification.deleteMany({ customerId: req.params.customerId });
    res.json({ message: "Đã xoá tất cả thông báo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
