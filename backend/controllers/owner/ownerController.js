const Event = require("../../models/eventModel");

// GET /api/owner/events - Get all events by logged-in owner
const getMyEvents = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const events = await Event.find({ ownerId });
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching owner events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

module.exports = { getMyEvents };
