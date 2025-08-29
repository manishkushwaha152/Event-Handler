const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Owner = require("../models/ownerModel");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    if (decoded.role === "user") {
      user = await User.findById(decoded.id);
    } else if (decoded.role === "owner") {
      user = await Owner.findById(decoded.id);
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.role = decoded.role; // optional: if you want to access the role later
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = { authenticate };
