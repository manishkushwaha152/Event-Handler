const User = require("../../models/userModel");
const path = require("path");

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;

    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Logout (frontend side token clear karna hoga)
const logoutUser = (req, res) => {
  res.clearCookie("token"); // agar cookie-based auth hai
  res.json({ message: "Logged out successfully" });
};

module.exports = { getUserProfile, updateUserProfile, logoutUser };
