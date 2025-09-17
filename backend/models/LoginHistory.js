const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  loginTime: { type: Date, default: Date.now },
  ipAddress: { type: String },
  status: { type: String, enum: ['success', 'failed'], required: true },
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
