const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admCode: {
    type: String,
    required: true,
    unique: true
  },
  customerCode: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Admin", adminSchema);
