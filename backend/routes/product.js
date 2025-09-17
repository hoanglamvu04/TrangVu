const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const upload = require("../middlewares/uploadProductImage");

/* ============ SLUG HELPERS ============ */
const slugifyVN = (str = "") =>
  (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")        // bỏ dấu
    .replace(/đ/g, "d").replace(/Đ/g, "D")  // đ -> d
    .replace(/[^a-zA-Z0-9\s-]/g, "")        // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-")                   // space -> -
    .replace(/-+/g, "-")                    // gộp -
    .toLowerCase()
    .slice(0, 120);                         // giới hạn an toàn

const ensureUniqueCode = async (base) => {
  let code = base || "sp";
  if (!(await Product.findOne({ code }).lean())) return code;

  // nếu đã tồn tại -> gắn hậu tố -2, -3, ...
  let i = 2;
  while (await Product.findOne({ code: `${base}-${i}` }).lean()) {
    i++;
    if (i > 1e6) throw new Error("Code generator overflow");
  }
  return `${base}-${i}`;
};
/* ===================================== */

const calculateFinalPrice = (original, discount) => {
  const o = Number(original) || 0;
  const d = Number(discount) || 0;
  return +(o - (o * d) / 100).toFixed(2);
};

/* ============ CREATE PRODUCT ============ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, originalPrice, discount, category: categoryId, status } = req.body;
    if (!name || !originalPrice || !categoryId) {
      return res.status(400).json({ message: "Thiếu name / originalPrice / category" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Danh mục không tồn tại" });

    // ƯU TIÊN code client gửi, nếu không có thì lấy theo name
    const baseCode = slugifyVN((req.body.code || name || "").toString());
    const code = await ensureUniqueCode(baseCode);

    const original = Number(originalPrice) || 0;
    const disc = Number(discount) || 0;
    const finalPrice = calculateFinalPrice(original, disc);

    const imagePath = req.file ? `/uploads/products/${code}/${req.file.filename}` : "";

    const descriptions =
      typeof req.body.descriptions === "string"
        ? (() => { try { return JSON.parse(req.body.descriptions); } catch { return []; } })()
        : Array.isArray(req.body.descriptions)
        ? req.body.descriptions
        : [];

    const tags =
      Array.isArray(req.body.tags)
        ? req.body.tags
        : typeof req.body.tags === "string"
        ? req.body.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    const newProduct = new Product({
      code,
      name,
      originalPrice: original,
      discount: disc,
      finalPrice,
      category: category._id,
      status,
      image: imagePath,
      descriptions,
      tags,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============ UPDATE PRODUCT ============ */
// KHÔNG tự đổi code nếu client không yêu cầu.
// Nếu client gửi `code`, ta slugify + check trùng an toàn.
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const base = await Product.findById(id).lean();
    if (!base) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // xử lý code (nếu client gửi)
    let nextCode;
    if (typeof req.body.code === "string" && req.body.code.trim()) {
      const requested = slugifyVN(req.body.code.trim());
      if (requested !== base.code) {
        // nếu khác code hiện tại -> phải đảm bảo unique
        nextCode = await ensureUniqueCode(requested);
      } else {
        nextCode = base.code;
      }
    }

    const imgPath = req.file
      ? `/uploads/products/${(nextCode || base.code)}/${req.file.filename}`
      : req.body.imagePath;

    // descriptions
    let descriptions;
    if (typeof req.body.descriptions === "string") {
      try { descriptions = JSON.parse(req.body.descriptions); } catch { descriptions = undefined; }
    } else if (Array.isArray(req.body.descriptions)) {
      descriptions = req.body.descriptions;
    }

    // tags
    let tags;
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    } else if (typeof req.body.tags === "string") {
      tags = req.body.tags.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const original = req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : undefined;
    const disc = req.body.discount !== undefined ? Number(req.body.discount) : undefined;

    const final =
      original !== undefined || disc !== undefined
        ? calculateFinalPrice(
            original !== undefined ? original : base.originalPrice || 0,
            disc !== undefined ? disc : base.discount || 0
          )
        : undefined;

    const payload = {
      code: nextCode, // chỉ set khi có yêu cầu đổi
      name: req.body.name,
      originalPrice: original,
      discount: disc,
      finalPrice: final !== undefined ? final : req.body.finalPrice,
      category: req.body.category ? new mongoose.Types.ObjectId(req.body.category) : undefined,
      status: req.body.status,
      image: imgPath,
      descriptions,
      tags,
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const updated = await Product.findByIdAndUpdate(id, payload, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/descriptions", async (req, res) => {
  try {
    const { type, title, content, image } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    product.descriptions.push({ type, title, content, image });
    await product.save();

    res.json({ message: "Đã thêm mô tả", product });
  } catch (err) {
    console.error("POST /products/:id/descriptions error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const abs = path.join(__dirname, "..", product.image);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/category/:categoryCode", async (req, res) => {
  try {
    const category = await Category.findOne({ categoryCode: req.params.categoryCode });
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại" });

    const products = await Product.find({ category: category._id });
    res.json(products);
  } catch (err) {
    console.error("GET /products/category/:categoryCode error:", err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo danh mục", error: err.message });
  }
});

router.get("/best-sellers", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 24);

    const agg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productCode", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
    ]);

    const codes = agg.map((a) => a._id);
    if (!codes.length) return res.json([]);

    const products = await Product.find({ code: { $in: codes } });
    const mapSold = new Map(agg.map((a) => [a._id, a.totalSold]));
    const result = products
      .map((p) => ({ ...p.toObject(), totalSold: mapSold.get(p.code) || 0 }))
      .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));

    res.json(result);
  } catch (err) {
    console.error("GET /products/best-sellers error:", err);
    res.status(500).json({ message: "Lỗi lấy sản phẩm bán chạy", error: err.message });
  }
});

module.exports = router;
