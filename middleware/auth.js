const jwt = require("jsonwebtoken");
require("dotenv").config();

function authentication(req, res, next) {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authentication denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid Token" });
  }
}

module.exports = authentication;
