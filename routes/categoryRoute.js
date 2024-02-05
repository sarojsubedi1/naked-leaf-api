const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const upload = require("../middleware/upload.js");

const categoryController = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/", categoryController.getallcategory);

router.get("/:categoryId", categoryController.getCategoryWithId);

router.post("/", authMiddleware, categoryController.addcategory);

router.put(
  "/:categoryId",
  authMiddleware,
  upload.single("icon"),
  categoryController.updateCategoryWithId,
);

module.exports = router;
