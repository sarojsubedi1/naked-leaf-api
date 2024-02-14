const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dec: {
      type: String,
      required: true,
    },
    richDec: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
    images: [{ type: String }],
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
