const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  productCode: String,
  name: String,
  selectedColor: String,
  selectedSize: String,
  quantity: Number,
  price: Number,
  image: String
});

module.exports = mongoose.model("Cart", cartItemSchema);
