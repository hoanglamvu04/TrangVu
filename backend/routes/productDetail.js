const express = require("express");
const router = express.Router();
const ProductDetail = require("../models/ProductDetail");
const upload = require("../middlewares/uploadDetailImage");
const path = require("path");

// GET theo mã sản phẩm
router.get("/:productCode", async (req, res) => {
  try {
    const details = await ProductDetail.find({ productCode: req.params.productCode });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy chi tiết sản phẩm" });
  }
});

// POST thêm mới
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { productCode, colorCode, colorName, size, quantity } = req.body;

    const imagePath = req.file ? `/uploads/products/${productCode}/${req.file.filename}` : null;

    const newDetail = new ProductDetail({
      detailCode: "CT" + Date.now(),
      productCode,
      colorCode,
      colorName,
      size,
      quantity,
      image: imagePath,
    });

    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi thêm chi tiết" });
  }
});

// PUT cập nhật
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { productCode, colorCode, colorName, size, quantity, existingImage } = req.body;

    const imagePath = req.file
      ? `/uploads/products/${productCode}/${req.file.filename}`
      : existingImage;

    const updated = await ProductDetail.findByIdAndUpdate(
      req.params.id,
      { productCode, colorCode, colorName, size, quantity, image: imagePath },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi cập nhật chi tiết" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await ProductDetail.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ error: "Xoá thất bại" });
  }
});

module.exports = router;
