const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  detailCode: String,
  productCode: String,
  colorCode: String,
  colorName: String,
  size: String,
  quantity: Number,
  images: { type: [String], default: [] }, 
});

module.exports = mongoose.model("ProductDetail", productDetailSchema);
