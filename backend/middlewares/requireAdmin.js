const Admin = require("../models/Admin");

// Lấy customerCode từ header 'x-customer-code' (ưu tiên), hoặc query/body
module.exports = async function requireAdmin(req, res, next) {
  try {
    const code =
      req.headers["x-customer-code"] ||
      req.query.customerCode ||
      req.body.customerCode;

    if (!code) {
      return res.status(401).json({ message: "Thiếu customerCode để kiểm tra quyền admin." });
    }

    const admin = await Admin.findOne({ customerCode: code }).lean();
    if (!admin) return res.status(403).json({ message: "Chỉ admin mới thực hiện được." });

    req.admin = admin; // { _id, admCode, customerCode }
    next();
  } catch (e) {
    return res.status(500).json({ message: "Lỗi kiểm tra quyền admin", error: e.message });
  }
};
