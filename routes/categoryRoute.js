const express = require("express");
const categoryController = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/", categoryController.getallcategory);
router.get("/:categoryId", categoryController.getCategoryWithId);
router.post("/", categoryController.addcategory);

module.exports = router;
