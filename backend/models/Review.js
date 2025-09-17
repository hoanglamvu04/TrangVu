const mongoose = require("mongoose");

const adminReplySchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    adminCode: String,             // ví dụ ADM-TV18
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  productCode:       { type: String, required: true },
  productDetailCode: { type: String },

  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  image:   { type: String },

  // bổ sung nếu bạn chưa có:
  selectedColor:      { type: String },   // mã màu (hex hoặc tên)
  selectedColorName:  { type: String },   // tên màu hiển thị
  selectedSize:       { type: String },

  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },

  // phản hồi của admin
  adminReplies: [adminReplySchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
