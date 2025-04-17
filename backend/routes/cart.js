const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Lấy toàn bộ giỏ hàng theo customerId
router.get("/:customerId", async (req, res) => {
  try {
    const items = await Cart.find({ customerId: req.params.customerId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
router.post("/:customerId/add", async (req, res) => {
  const { productCode, selectedColor, selectedSize, quantity, image, name, price } = req.body;
  const customerId = req.params.customerId;

  try {
    const existing = await Cart.findOne({
      customerId,
      productCode,
      selectedColor,
      selectedSize
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const newItem = await Cart.create({
      customerId,
      productCode,
      selectedColor,
      selectedSize,
      quantity,
      image,
      name,
      price
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật số lượng
router.put("/:customerId/update", async (req, res) => {
  const { productCode, selectedColor, selectedSize, quantity } = req.body;
  try {
    const item = await Cart.findOneAndUpdate(
      { customerId: req.params.customerId, productCode, selectedColor, selectedSize },
      { quantity },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xoá sản phẩm
router.delete("/:customerId/delete", async (req, res) => {
  const { productCode, selectedColor, selectedSize } = req.body;
  try {
    await Cart.deleteOne({
      customerId: req.params.customerId,
      productCode,
      selectedColor,
      selectedSize
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xoá toàn bộ giỏ hàng theo customerId
router.delete("/clear/:customerId", async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({ customerId: req.params.customerId });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy giỏ hàng để xoá" });
    res.json({ message: "Đã xoá giỏ hàng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
