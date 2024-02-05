const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const upload = require("../middleware/upload.js");
const productController = require("../controllers/productController.js");

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  authMiddleware,
  productController.addProduct,
);

router.get("/", productController.getAllProduct);
router.get("/:productId", productController.getProduct);
router.delete("/:productId", authMiddleware, productController.deleteProduct);

module.exports = router;
