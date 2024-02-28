const express = require("express");

const authentication = require("../middleware/auth.js");

const cartController = require("../controllers/cartController.js");

const router = express.Router();

// Get user cart
router.get("/", authentication, cartController.getCart);

// add  product in cart
router.post("/", authentication, cartController.addtocart);

// increase product qty
router.put("/in/:productId", authentication, cartController.increaseQty);

//decrease product qty
router.put("/de/:productId", authentication, cartController.decreaseQty);

// remove from cart
router.delete("/rm/:productId", authentication, cartController.removeFromCart);

module.exports = router;
