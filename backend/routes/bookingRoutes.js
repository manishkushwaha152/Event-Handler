const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getEventBookings,
  cancelBooking,
  downloadTicketPDF,
} = require("../controllers/booking/bookingController");
const { authenticate } = require("../middleware/authMiddleware");

// 🔐 Create a new booking
// POST /api/bookings/
router.post("/", authenticate, createBooking);

// 🔐 Get current user's bookings
// GET /api/bookings/my
router.get("/user", authenticate, getUserBookings);

// 🔐 Get all bookings for a specific event (for owners/admin)
// GET /api/bookings/event/:eventId
router.get("/event/:eventId", authenticate, getEventBookings);

// 🔐 Cancel a booking by ID (user only)
// DELETE /api/bookings/:id
router.delete("/:id", authenticate, cancelBooking);

router.get("/download/:bookingId", authenticate,downloadTicketPDF);
module.exports = router;
