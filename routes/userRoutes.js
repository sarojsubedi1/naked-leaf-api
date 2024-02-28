const express = require("express");
const authorization = require("../middleware/authorization.js");

const upload = require("../middleware/upload.js");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createUser);

router.post("/auth", userController.authUser);

router.get("/all", authorization, userController.getAllUser);

router.get("/:userId", userController.getUser);

router.delete("/:userId", authorization, userController.deleteUser);

router.put("/:userId", upload.single("profile"), userController.updateUser);

module.exports = router;
