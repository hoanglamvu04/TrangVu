const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ✅ Kiểm tra người dùng có phải là admin không qua mã khách hàng
router.get("/check-by-code/:customerCode", async (req, res) => {
  try {
    const admin = await Admin.findOne({ customerCode: req.params.customerCode });
    res.json({ isAdmin: !!admin });
  } catch (error) {
    console.error("Lỗi kiểm tra admin:", error);
    res.status(500).json({ error: "Lỗi kiểm tra quyền admin" });
  }
});

// ✅ (Tùy chọn) Tạo admin mới - dùng tạm thời để thêm tay admin
router.post("/create", async (req, res) => {
  try {
    const { admCode, customerCode } = req.body;

    if (!admCode || !customerCode) {
      return res.status(400).json({ error: "Thiếu mã admin hoặc mã khách hàng" });
    }

    const newAdmin = new Admin({ admCode, customerCode });
    await newAdmin.save();

    res.status(201).json({ message: "Tạo admin thành công", admin: newAdmin });
  } catch (error) {
    console.error("Lỗi tạo admin:", error);
    res.status(500).json({ error: "Không thể tạo admin" });
  }
});

module.exports = router;
