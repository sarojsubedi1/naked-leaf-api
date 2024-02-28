const express = require("express");
const authorization = require("../middleware/authorization.js");

const upload = require("../middleware/upload.js");

const categoryController = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/", categoryController.getallcategory);

router.get("/:categoryId", categoryController.getCategoryWithId);

router.post("/", authorization, categoryController.addcategory);

router.put(
  "/:categoryId",
  authorization,
  upload.single("icon"),
  categoryController.updateCategoryWithId,
);

module.exports = router;
