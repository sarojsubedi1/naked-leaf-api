const User = require("../models/userModel.js");

const { uploadToCloud } = require("../utils/cloudinary.js");

const generateToken = require("../utils/generateToken.js");
const bcrypt = require("bcrypt");

// @desc   Create user/register user
// route   POST /api/users
exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = generateToken({
      id: savedUser._id,
      name: savedUser.username,
      role: savedUser.role,
      profile: savedUser.profile,
    });

    res
      .status(200)
      .json({ sucess: true, message: "User registered sucessfully.", token });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// @desc   Auth user/set token/login user
// route   POST /api/users/auth
exports.authUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check user in database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare passoword
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({ message: "Login sucessfully.", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

// Delete user
// POST /api/users/profile
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc   Get User by id
// route   GET /api/users
exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${userId} not found` });
    }

    res.status(200).json({
      id: user._id,
      name: user.username,
      profile: user.profile,
      role: user.role,
    });
  } catch (error) {
    res.json({ message: "Error retrieving user", error });
  }
};

// @desc   Get all User
// route   GET /api/users
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.json({ error: "Api error" });
  }
};

// @desc   Update user profile
// route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      const { mimetype, buffer } = req.file;
      const base64 = buffer.toString("base64");

      const result = await uploadToCloud(`data:${mimetype};base64,${base64}`, {
        folder: "users/",
      });
      user.profile = result.secure_url;
    }

    if (req.body.username) {
      user.username = req.body.username;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.protected = async (req, res) => {
  res.json({ msg: "You have access to this protected route" });
};
