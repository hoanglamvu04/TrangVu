const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ProductDescription = require("../models/ProductDescription");

const upload = multer({ dest: "uploads/" });

// GET all descriptions for a product
router.get("/:productCode", async (req, res) => {
  try {
    const descs = await ProductDescription.find({ productCode: req.params.productCode });
    res.json(descs);
  } catch {
    res.status(500).send("Lỗi lấy mô tả");
  }
});

// POST create new description
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { productCode, type, title, content } = req.body;
    const desc = new ProductDescription({
      productCode,
      type,
      title,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    await desc.save();
    res.status(201).json(desc);
  } catch {
    res.status(500).send("Lỗi thêm mô tả");
  }
});

// PUT update description
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { type, title, content } = req.body;
    const desc = await ProductDescription.findById(req.params.id);
    if (!desc) return res.status(404).send("Không tìm thấy");

    if (req.file && desc.image) {
      const oldPath = path.join(__dirname, "..", desc.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    desc.type = type;
    desc.title = title;
    desc.content = content;
    if (req.file) desc.image = `/uploads/${req.file.filename}`;
    await desc.save();
    res.json(desc);
  } catch {
    res.status(500).send("Lỗi cập nhật mô tả");
  }
});

// DELETE description
router.delete("/:id", async (req, res) => {
  try {
    const desc = await ProductDescription.findByIdAndDelete(req.params.id);
    if (desc?.image) {
      const imgPath = path.join(__dirname, "..", desc.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.send("Đã xoá");
  } catch {
    res.status(500).send("Lỗi xoá mô tả");
  }
});

module.exports = router;
