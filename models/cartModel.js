const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Product",
      },
      cartQty: {
        type: Number,
        default: 1,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

cartSchema.pre("save", async function (next) {
  await this.populate("items.product");
  let total = 0;
  for (let item of this.items) {
    total += item.product.price * item.cartQty;
  }
  this.total = total;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
