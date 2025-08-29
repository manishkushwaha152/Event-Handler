const Owner = require("../../models/ownerModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../config/jwt");

exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "owner",
    });

    const token = generateToken(newOwner._id, "owner");

    res.status(201).json({
      success: true,
      token,
      owner: {
        _id: newOwner._id,
        name: newOwner.name,
        email: newOwner.email,
        mobile: newOwner.mobile,
        role: newOwner.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(owner._id, "owner");

    res.json({
      success: true,
      token,
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        mobile: owner.mobile,
        role: owner.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
