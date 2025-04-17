const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  orderCode: { type: String, default: "" },
  type: {
    type: String,
    enum: ["placed", "confirmed", "shipping", "delivered", "cancelled"],
    default: "placed"
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
