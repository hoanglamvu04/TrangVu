const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Lấy danh sách danh mục
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});

// Thêm danh mục mới
router.post("/", async (req, res) => {
  try {
    const { categoryCode, name, description, status } = req.body;
    const newCategory = new Category({ categoryCode, name, description, status });
    await newCategory.save();
    res.status(201).json({ message: "Category created", category: newCategory });
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
});

// PUT - cập nhật danh mục
router.put("/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
});

module.exports = router;
