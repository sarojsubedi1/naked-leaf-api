const express = require("express");
const authorization = require("../middleware/authorization.js");

const upload = require("../middleware/upload.js");
const productController = require("../controllers/productController.js");

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  authorization,
  productController.addProduct,
);

router.get("/", productController.getAllProduct);

router.get("/:productId", productController.getProduct);

router.put(
  "/:productId",
  upload.single("image"),
  authorization,
  productController.editProduct,
);

router.delete("/:productId", authorization, productController.deleteProduct);

module.exports = router;
