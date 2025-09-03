const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  logoutUser
} = require('../controllers/user/userController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Profile routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, upload.single("avatar"), updateUserProfile);
router.post('/logout', authenticate, logoutUser);

module.exports = router;
