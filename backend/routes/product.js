const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const upload = require("../middlewares/uploadProductImage");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// 🔢 Hàm rút gọn tên danh mục thành mã viết tắt
const getCategoryCode = (name) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/[^a-zA-Z ]/g, "") // bỏ ký tự đặc biệt
    .split(" ")
    .map((word) => word[0]?.toLowerCase())
    .join("");
};

// 🧮 Tính finalPrice từ discount %
const calculateFinalPrice = (original, discount) => {
  return +(original - (original * discount) / 100).toFixed(2);
};

// 🔹 Tạo mã sản phẩm tự động
const generateProductCode = async (categoryName) => {
  const prefix = getCategoryCode(categoryName);
  let index = 1;
  let code;
  while (true) {
    code = `${prefix}${index}`;
    const exists = await Product.findOne({ code });
    if (!exists) break;
    index++;
  }
  return code;
};

// 🔹 Thêm sản phẩm mới
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, originalPrice, discount, category: categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Danh mục không tồn tại" });

    const finalPrice = calculateFinalPrice(parseFloat(originalPrice), parseFloat(discount));

    const code = req.body.code?.trim() || (await generateProductCode(category.name));

    const imagePath = req.file
      ? `/uploads/products/${code}/${req.file.filename}`
      : "";

    const newProduct = new Product({
      code,
      name,
      originalPrice: parseFloat(originalPrice),
      discount: parseFloat(discount),
      finalPrice,
      category: category._id,
      status: req.body.status,
      image: imagePath,
      descriptions: req.body.descriptions || [],
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Cập nhật sản phẩm
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/products/${req.body.code}/${req.file.filename}`
      : req.body.imagePath;

    const updateData = {
      code: req.body.code,
      name: req.body.name,
      originalPrice: parseFloat(req.body.originalPrice),
      discount: parseFloat(req.body.discount),
      finalPrice: parseFloat(req.body.finalPrice),
      category: req.body.category,
      status: req.body.status,
      image: imagePath,
      descriptions: req.body.descriptions
        ? JSON.parse(req.body.descriptions)
        : undefined,
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔹 API riêng để thêm mô tả sản phẩm
router.post("/:id/descriptions", async (req, res) => {
  try {
    const { type, title, content, image } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    product.descriptions.push({ type, title, content, image });
    await product.save();

    res.json({ message: "Đã thêm mô tả", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Xoá sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Lấy sản phẩm theo mã danh mục
router.get("/category/:categoryCode", async (req, res) => {
  try {
    const category = await Category.findOne({ categoryCode: req.params.categoryCode });
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại" });

    const products = await Product.find({ category: category._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo danh mục", error: err.message });
  }
});



module.exports = router;
