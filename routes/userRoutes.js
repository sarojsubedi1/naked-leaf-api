const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const upload = require("../middleware/upload.js");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/ffff", authMiddleware, userController.protected);

router.post("/", userController.createUser);

router.post("/auth", userController.authUser);

router.get("/all", authMiddleware, userController.getAllUser);

router.get("/:userId", userController.getUser);

router.delete("/:userId", authMiddleware, userController.deleteUser);

router.put("/:userId", upload.single("profile"), userController.updateUser);

module.exports = router;
