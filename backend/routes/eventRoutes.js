const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { authenticate } = require("../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPublicEvents,
} = require("../controllers/event/eventController");

const Event = require("../models/eventModel");

// ---------------- PUBLIC ROUTES ----------------

router.get("/public", getPublicEvents);

router.get("/events", async (req, res) => {
  try {
    const { search = "", sort = "asc" } = req.query;

    const query = {
      status: "approved",
      title: { $regex: search, $options: "i" },
    };

    const events = await Event.find(query).select("title image area city date price");
    res.json(events);
  } catch (err) {
    console.error("Public /events error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Seats: Public GET (user seat map)


// ---------------- OWNER ROUTES ----------------

router.get("/owner-events", authenticate, async (req, res) => {
  try {
    const events = await Event.find({
      ownerId: req.user._id,
      status: "approved",
    }).select("title _id");
    res.json(events);
  } catch (err) {
    console.error("Error fetching owner events:", err);
    res.status(500).json({ message: "Failed to fetch owner events" });
  }
});

// ✅ NEW: Add seats for specific event by eventId


// ---------------- PROTECTED EVENT ROUTES ----------------

router.post("/", authenticate, upload.single("image"), createEvent);
router.get("/", authenticate, getEvents);
router.put("/:id", authenticate, upload.single("image"), updateEvent);
router.delete("/:id", authenticate, deleteEvent);

// ⚠️ Keep this last to prevent conflicts
router.get("/:id", getEventById);

module.exports = router;
