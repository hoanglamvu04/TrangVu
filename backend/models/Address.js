const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "", 
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true, 
  },
  phoneNumber: {
    type: String,
    required: true, // Bắt buộc nhập số điện thoại liên hệ
  },
  fullAddress: {
    type: String,
    required: true, 
  }
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);
