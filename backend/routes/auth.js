const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");


// ===================== ĐĂNG KÝ =====================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, birthDate } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại!" });

    const customerCode = await Customer.generateCustomerCode(); // Tự động TV00, TV01,...
    const hash = await bcrypt.hash(password, 10);

    const customer = new Customer({
      customerCode,
      fullName,
      email,
      password: hash,
      phoneNumber,
      birthDate,
      avatar: "/uploads/default-avatar.png" // ảnh mặc định
    });

    await customer.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// ===================== ĐĂNG NHẬP =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    res.json({ message: "Đăng nhập thành công", user });
  } catch (err) {
    console.error("Đăng nhập lỗi:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// ===================== CẬP NHẬT THÔNG TIN NGƯỜI DÙNG =====================
router.put("/update/:id", async (req, res) => {
  try {
    const { fullName, phoneNumber, birthDate, avatar } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        phoneNumber,
        birthDate,
        avatar,
      },
      { new: true }
    );

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed;
    await user.save();

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
});


// ===================== UPLOAD AVATAR =====================
router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });

  const filePath = `/uploads/avatars/${req.file.filename}`;
  res.status(200).json({ filePath });
});


// ===================== CHECK EMAIL =====================
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email không được bỏ trống." });
  }

  try {
    const existing = await Customer.findOne({ email });
    res.json({ exists: !!existing });
  } catch (err) {
    console.error("Lỗi check-email:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
