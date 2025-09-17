const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: String,
  originalPrice: Number,
  discount: Number,
  finalPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  status: String,
  image: String,
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  descriptions: [
    {
      type: { type: String, required: true },
      title: String,
      content: String,
      image: String
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
