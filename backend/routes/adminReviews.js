const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const requireAdmin = require("../middlewares/requireAdmin");

// GET /api/admin/reviews?status=Pending|Approved|Rejected|All&productCode=&q=
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status = "Pending", productCode = "", q = "" } = req.query;
    const query = {};
    if (status !== "All") query.status = status;
    if (productCode) query.productCode = productCode;
    if (q) query.comment = { $regex: q, $options: "i" };

    const reviews = await Review.find(query)
      .populate("customer", "fullName email")
      .populate("order", "orderCode status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách đánh giá", error: err.message });
  }
});

// PUT /api/admin/reviews/:id/status   { status: "Approved" | "Rejected" | "Pending" }
router.put("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const updated = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("customer", "fullName email")
      .lean();
    if (!updated) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được trạng thái", error: err.message });
  }
});

// DELETE /api/admin/reviews/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const r = await Review.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json({ message: "Đã xoá đánh giá" });
  } catch (err) {
    res.status(500).json({ message: "Không xoá được đánh giá", error: err.message });
  }
});

// POST /api/admin/reviews/:id/replies   { content: "..." }
router.post("/:id/replies", requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Nội dung phản hồi trống." });

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
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
      .populate("customer", "fullName email")
      .lean();

    if (!updated) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Không gửi được phản hồi", error: err.message });
  }
});

// (tuỳ chọn) nhanh theo productCode: GET /api/admin/reviews/product/:productCode?status=All
router.get("/product/:productCode", requireAdmin, async (req, res) => {
  try {
    const { status = "All" } = req.query;
    const query = { productCode: req.params.productCode };
    if (status !== "All") query.status = status;
    const reviews = await Review.find(query)
      .populate("customer", "fullName email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được đánh giá theo sản phẩm", error: err.message });
  }
});

module.exports = router;
