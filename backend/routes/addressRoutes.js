const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

router.get("/:customerId", async (req, res) => {
  try {
    const addresses = await Address.find({ customerId: req.params.customerId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { customerId, label, province, district, ward, detail, phoneNumber } = req.body;

  if (!customerId || !province || !district || !ward || !detail || !phoneNumber) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  try {
    const newAddress = new Address({
      customerId,
      label: label || "",
      province,
      district,
      ward,
      detail,
      phoneNumber,
      fullAddress: `${detail}, ${ward}, ${district}, ${province}`
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { label, province, district, ward, detail, phoneNumber } = req.body;

  if (!province || !district || !ward || !detail || !phoneNumber) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      {
        label: label || "",
        province,
        district,
        ward,
        detail,
        phoneNumber,
        fullAddress: `${detail}, ${ward}, ${district}, ${province}`
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xoá địa chỉ
router.delete("/:id", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá địa chỉ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
