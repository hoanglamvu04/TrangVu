const jwt = require("jsonwebtoken");

// Lấy secret key từ biến môi trường
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie

  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập" }); // Nếu không có token, trả về lỗi 401
  }

  try {
    // Giải mã token và xác thực token bằng secret key
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // Lưu thông tin người dùng vào req.user

    next(); // Tiếp tục xử lý yêu cầu
  } catch (err) {
    // Nếu token không hợp lệ hoặc hết hạn, trả về lỗi 403
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authenticate;
