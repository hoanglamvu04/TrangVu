const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");

const resetCodes = new Map();

exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  const user = await Customer.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email không tồn tại" });

  const code = crypto.randomInt(100000, 999999).toString();
  resetCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mail.lamzu@gmail.com",
      pass: "xnwb didq ocbm zzya",
    },
  });

  const mailOptions = {
    from: "TV_Fashion <mail.lamzu@gmail.com>",
    to: email,
    subject: "Mã xác nhận đặt lại mật khẩu",
    text: `Mã xác nhận của bạn là: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Đã gửi mã xác nhận" });
  } catch (err) {
    res.status(500).json({ message: "Không gửi được email" });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const saved = resetCodes.get(email);
  if (!saved || saved.code !== code || Date.now() > saved.expires) {
    return res.status(400).json({ success: false, message: "Mã không hợp lệ hoặc hết hạn" });
  }
  res.json({ success: true });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const saved = resetCodes.get(email);
  if (!saved || saved.code !== code || Date.now() > saved.expires) {
    return res.status(400).json({ message: "Mã không hợp lệ hoặc đã hết hạn" });
  }

  const user = await Customer.findOne({ email });
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    resetCodes.delete(email);
    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật mật khẩu" });
  }
};
