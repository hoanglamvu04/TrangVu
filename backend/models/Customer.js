const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{9,11}$/,
    trim: true
  },
  birthDate: {
    type: Date,
    default: null
  },
  avatar: {
    type: String,
    default: "" 
  },
  status: {
    type: String,
    enum: ["Active", "Blocked", "Pending"],
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.statics.generateCustomerCode = async function () {
  const latest = await this.findOne().sort({ createdAt: -1 });
  if (!latest || !latest.customerCode) return "TV00";

  const match = latest.customerCode.match(/TV(\d{2})/);
  if (!match) return "TV00";

  const nextNumber = parseInt(match[1], 10) + 1;
  return `TV${nextNumber.toString().padStart(2, '0')}`;
};

module.exports = mongoose.model("Customer", customerSchema);
