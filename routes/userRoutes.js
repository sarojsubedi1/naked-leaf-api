const express = require("express");

const upload = require("../middleware/upload.js");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createUser);

router.post("/auth", userController.authUser);

router.get("/all", userController.getAllUser);

router.get("/:userId", userController.getUser);

router.delete("/:userId", userController.deleteUser);

router.put("/:userId", upload.single("profile"), userController.updateUser);

module.exports = router;
