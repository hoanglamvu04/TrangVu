const multer = require("multer");
const path = require("path");
const fs = require("fs");

// tạo thư mục nếu chưa có
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeBaseName(name = "") {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  return base.replace(/[^\w\-]+/g, "-");
}

// chấp nhận các mime ảnh, gồm cả AVIF
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/avif",     // <- AVIF
  "image/x-avif",   // <- một số môi trường cũ dùng mime này
]);

// fallback bằng phần mở rộng đề phòng server trả mime lạ
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg", ".avif"]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const productCode = (req.body.productCode || "unknown").toString();
    const colorCode = (req.body.colorCode || "").toString().replace(/[^\w\-]+/g, "-");
    const folder = colorCode
      ? path.join("uploads", "products", productCode, colorCode)
      : path.join("uploads", "products", productCode);
    ensureDirSync(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = safeBaseName(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const okMime = ALLOWED_MIME.has(file.mimetype.toLowerCase());
  const okExt = ALLOWED_EXT.has(path.extname(file.originalname).toLowerCase());
  if (!(okMime || okExt)) {
    return cb(new Error("Chỉ cho phép tải ảnh (PNG, JPG, WEBP, GIF, BMP, SVG, AVIF)."), false);
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB/ảnh (tăng nhẹ cho AVIF lớn)
});
