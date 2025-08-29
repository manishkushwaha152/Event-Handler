// const express = require("express");
// const { OAuth2Client } = require("google-auth-library");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel"); // tumhara user model

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // Google Login
// router.post("/user/google-login", async (req, res) => {
//   try {
//     const { token } = req.body;

//     // 🔹 Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();

//     // 🔹 Check if user already exists
//     let user = await User.findOne({ email: payload.email });
//     if (!user) {
//       user = await User.create({
//         email: payload.email,
//         name: payload.name,
//         googleId: payload.sub,
//       });
//     }

//     // 🔹 Generate own JWT
//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token: jwtToken, user });
//   } catch (err) {
//     console.error("Google login error:", err);
//     res.status(400).json({ message: "Google login failed" });
//   }
// });

// module.exports = router;
