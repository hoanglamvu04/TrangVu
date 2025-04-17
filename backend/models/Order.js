const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    {
      productName: String,
      quantity: Number,
      price: Number,
      color: String,
      size: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    fullAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },  
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo mã đơn hàng tự động
orderSchema.statics.generateOrderCode = async function () {
  const latest = await this.findOne().sort({ createdAt: -1 });
  const next = latest ? parseInt(latest.orderCode?.replace("DH", "")) + 1 : 1;
  return `DH${next.toString().padStart(4, "0")}`;
};

module.exports = mongoose.model("Order", orderSchema);
