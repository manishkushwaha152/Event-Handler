// routes/ownerRoutes.js

const express = require("express");
const { getMyEvents } = require("../controllers/owner/ownerController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/events", authenticate, getMyEvents);

module.exports = router;
