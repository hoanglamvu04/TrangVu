const mongoose = require("mongoose");

const ProductDescriptionSchema = new mongoose.Schema({
  productCode: { type: String, required: true },
  type: { type: String, enum: ["form", "material", "design"], required: true },
  title: { type: String, required: true },
  content: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("ProductDescription", ProductDescriptionSchema);
