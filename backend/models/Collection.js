const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    collectionCode: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    type: { type: String, enum: ["manual", "smart"], default: "manual" },
    rules: {
      tags: [String],
      priceMin: Number,
      priceMax: Number,
      discountMin: Number,
      categoryCodes: [String],
    },
    productCodes: [String],
    heroImage: String,
    bannerImage: String,
    priority: { type: Number, default: 0 },
    startAt: Date,
    endAt: Date,
    showInNav: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
