const jwt = require("jsonwebtoken");

const generateToken = ({ id, name, role, profile }) => {
  const token = jwt.sign({ id, name, role, profile }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  return token;
};

module.exports = generateToken;
