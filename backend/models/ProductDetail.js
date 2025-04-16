const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  detailCode: String,
  productCode: String,
  colorCode: String,
  colorName: String,
  size: String,
  quantity: Number,
  image: String, 
});

module.exports = mongoose.model("ProductDetail", productDetailSchema);
