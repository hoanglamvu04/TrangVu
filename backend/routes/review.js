// routes/review.routes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const Review = require("../models/Review");
const Order  = require("../models/Order");
const requireAdmin = require("../middlewares/requireAdmin");

// ===== Multer: /uploads/products/<productCode>/reviews =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const code = (req.body.productCode || "unknown").trim().toLowerCase();
    const dir  = path.join("uploads", "products", code, "reviews");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname || "");
    const base = `review-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, base);
  },
});
const upload = multer({ storage });

const imgPath = (productCode, filename) =>
  filename ? ("/" + path.join("uploads", "products", (productCode||"").toLowerCase(), "reviews", filename).replace(/\\/g,"/")) : "";

// ===== Tạo review (1 đơn + 1 sản phẩm(=biến thể) chỉ 1 lần) =====
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      customerId, orderId, productCode, productDetailCode,
      rating, comment, selectedColor, selectedColorName, selectedSize
    } = req.body;

    if (!customerId || !orderId || !productCode || !rating || !comment) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    // Đơn thuộc khách, đã Delivered và chứa sản phẩm
    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
      status: "Delivered",
      "items.productCode": productCode,
    }).lean();
    if (!order) {
      return res.status(400).json({ message: "Bạn cần mua và hoàn thành đơn hàng chứa sản phẩm này để đánh giá." });
    }

    // Không cho trùng trong cùng đơn + sản phẩm(+biến thể)
    const existed = await Review.findOne({
      customer: customerId,
      order: orderId,
      productCode,
      ...(productDetailCode ? { productDetailCode } : {}),
    }).lean();
    if (existed) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi." });
    }

    const image = req.file ? imgPath(productCode, req.file.filename) : "";

    // nếu FE không gửi màu/size thì lấy từ item trong order
    let colorCode = selectedColor || "";
    let sizeVal   = selectedSize || "";
    if (!colorCode || !sizeVal) {
      const orderItem = (order.items || []).find((it) => {
        const sameProduct = it.productCode === productCode;
        if (!sameProduct) return false;
        if (!productDetailCode) return true;
        return it.productDetailCode === productDetailCode || it.productDetail?.code === productDetailCode;
      });
      if (orderItem) {
        colorCode = colorCode || orderItem.selectedColor || orderItem.colorCode || orderItem.color || "";
        sizeVal   = sizeVal   || orderItem.selectedSize  || orderItem.size     || "";
      }
    }

    const review = await Review.create({
      customer: customerId,
      order: orderId,
      productCode,
      productDetailCode,
      selectedColor: colorCode || undefined,
      selectedColorName: selectedColorName || undefined,
      selectedSize: sizeVal || undefined,
      rating: Number(rating),
      comment,
      image,
      // status: Pending -> admin duyệt
    });

    return res.status(201).json(review);
  } catch (err) {
    console.error("[reviews.create]", err);
    return res.status(500).json({ message: "Lỗi khi gửi đánh giá", error: err.message });
  }
});

// ===== Public: danh sách review đã duyệt theo sản phẩm =====
router.get("/product/:productCode", async (req, res) => {
  try {
    const { productCode } = req.params;
    const reviews = await Review.find({ productCode, status: "Approved" })
      .populate("customer", "fullName")
      .sort({ createdAt: -1 })
      .lean();
    return res.json(reviews);
  } catch (err) {
    console.error("[reviews.listByProduct] ", err);
    return res.status(500).json({ message: "Lỗi khi lấy đánh giá", error: err.message });
  }
});

// ===== Dùng cho trang quản lý đơn cá nhân: map các item đã review =====
// Trả về dạng: { "<orderId>": ["<productCode>|<productDetailCode>", ...], ... }
router.get("/my-map/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const list = await Review.find({ customer: customerId }).select("order productCode productDetailCode").lean();
    const map = {};
    for (const r of list) {
      const k = r.productDetailCode ? `${r.productCode}|${r.productDetailCode}` : `${r.productCode}`;
      const o = String(r.order);
      if (!map[o]) map[o] = [];
      map[o].push(k);
    }
    return res.json(map);
  } catch (err) {
    console.error("[reviews.myMap] ", err);
    return res.status(500).json({ message: "Lỗi khi lấy map review", error: err.message });
  }
});

// ===== Admin: trả lời đánh giá =====
router.post("/:id/replies", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Nội dung trả lời trống." });

    const updated = await Review.findByIdAndUpdate(
      id,
      {
        $push: {
          adminReplies: {
            admin: req.admin._id,
            adminCode: req.admin.admCode,
            content,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate("customer", "fullName")
      .lean();

    if (!updated) return res.status(404).json({ message: "Không tìm thấy review." });
    return res.json(updated);
  } catch (err) {
    console.error("[reviews.reply] ", err);
    return res.status(500).json({ message: "Lỗi khi trả lời", error: err.message });
  }
});

// ===== Admin: duyệt / từ chối =====
router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" | "Rejected"
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }
    const updated = await Review.findByIdAndUpdate(id, { status }, { new: true })
      .populate("customer", "fullName")
      .lean();
    if (!updated) return res.status(404).json({ message: "Không tìm thấy review." });
    return res.json(updated);
  } catch (err) {
    console.error("[reviews.status] ", err);
    return res.status(500).json({ message: "Lỗi cập nhật trạng thái", error: err.message });
  }
});

// ===== Admin: xóa review =====
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[reviews.delete] ", err);
    return res.status(500).json({ message: "Lỗi xóa review", error: err.message });
  }
});

module.exports = router;
