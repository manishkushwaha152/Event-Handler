const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");

// JWT Token Generator
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not defined in .env file.");
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register User Controller
exports.registerUser = async (req, res) => {
  try {
    let { name, email, password, mobile } = req.body;

    // Normalize email
    email = email?.toLowerCase();

    // Validation
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });
    await newUser.save();

    //  Send Welcome Email (safe block)
    try {
  await sendEmail({
    to: email,
    subject: "Welcome to Event Booking Platform",
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering on our platform.</p>
      <p>Start exploring and booking amazing events today!</p>
      <br/>
      <p>– Team EventBook</p>
    `
  });
} catch (err) {
  console.warn("⚠️ Email sending failed, but user registered:", err.message);
}
    // 🎟 Generate Token
    const token = generateToken(newUser._id, "user");

    // Success response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User Controller
exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalize email
    email = email?.toLowerCase();

    // 🔍 Check user exists
    const existing = await User.findOne({ email });
    if (!existing) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, existing.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //  Generate Token
    const token = generateToken(existing._id, "user");

    //  Success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: existing._id,
        name: existing.name,
        email: existing.email,
        mobile: existing.mobile,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
