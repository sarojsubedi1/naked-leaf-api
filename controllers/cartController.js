const Cart = require("../models/cartModel.js");

// get cart with userId
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.id }).populate(
      "items.product",
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add item to cart
exports.addtocart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, cartQty } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex !== -1) {
      cart.items[itemIndex].cartQty += cartQty;
    } else {
      cart.items.push({ product: productId, cartQty });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//increase qty
exports.increaseQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.id;

    let cart = await Cart.findOne({ userId });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].cartQty += 1;

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//decrease qty
exports.decreaseQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.id;

    let cart = await Cart.findOne({ userId });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cart.items[itemIndex].cartQty > 1) {
      cart.items[itemIndex].cartQty--;
    }

    console.log(cart.items[itemIndex].cartQty);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.id;

    let cart = await Cart.findOne({ userId });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.json({ sucess: true, msg: "Item Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
