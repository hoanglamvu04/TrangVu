const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");

// ✅ GET danh sách người dùng
router.get("/", async (req, res) => {
  try {
    const users = await Customer.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ✅ POST thêm người dùng mới
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, birthDate, status } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Tạo mã khách hàng
    const customerCode = await Customer.generateCustomerCode();

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      customerCode,
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      birthDate: birthDate || null,
      status: status || "Active",
      avatar: "/uploads/default-avatar.png"
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error("Lỗi khi thêm khách hàng:", err);
    res.status(500).json({ message: "Lỗi tạo người dùng", error: err.message });
  }
});

// ✅ DELETE người dùng
router.delete("/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá người dùng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá người dùng", error: err.message });
  }
});

// ✅ PUT cập nhật người dùng
router.put("/:id", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, birthDate, status } = req.body;
    const updatedUser = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phoneNumber,
        birthDate: birthDate || null,
        status,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật người dùng", error: err.message });
  }
});

module.exports = router;
