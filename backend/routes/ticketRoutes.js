const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  addSeatsToEvent,
  getSeatsByEvent,
} = require("../controllers/ticket/ticketController");

const { authenticate } = require("../middleware/authMiddleware");

// ------------------------ Ticket Routes ------------------------

// 🔹 Create a ticket (Owner only)
router.post("/", authenticate, createTicket);

// 🔹 Get all tickets (or by eventId)
router.get("/", getTickets);

// ------------------------ Seat Routes -------------------------

// 🔹 Add seats to an event (Owner only)
router.post("/add-seats/:eventId", authenticate, (req, res, next) => {
  console.log("🔥 HIT /add-seats/:eventId route");
  next();
}, addSeatsToEvent);



// 🔹 Get seats for an event
router.get("/event/:eventId/seats", getSeatsByEvent);

module.exports = router;
