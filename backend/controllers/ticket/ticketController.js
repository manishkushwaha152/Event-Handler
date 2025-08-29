const Ticket = require('../../models/ticketModel');
const Event = require('../../models/eventModel');

// --------------------- TICKET CONTROLLERS ------------------------

const createTicket = async (req, res) => {
  try {
    const { eventId, type, price, availableQuantity } = req.body;

    if (!eventId || !type || price == null || availableQuantity == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const ticket = await Ticket.create({ eventId, type, price, availableQuantity });
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'Server error while creating ticket' });
  }
};

const getTickets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;

    const tickets = await Ticket.find(filter)
      .select('type price availableQuantity')
      .lean();

    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

// --------------------- SEAT CONTROLLERS ------------------------

const addSeatsToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seats } = req.body;

    if (!eventId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Invalid seat data" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const seatsWithLabels = seats.map((seat) => {
  const row = seat.row?.toUpperCase();
  const number = parseInt(seat.number);
  const label = seat.label || `${row}${number}`; // ✅ fallback if missing

  return {
    row,
    number,
    label, // ✅ now always present
    category: seat.category,
    price: seat.price,
    status: seat.status || "available",
  };
});

    event.seats.push(...seatsWithLabels);
    await event.save();

    res.status(200).json({
      message: "Seats added successfully",
      seatsAdded: seatsWithLabels.length,
    });
  } catch (err) {
    console.error("❌ Seat add error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSeatsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event.seats);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).json({ message: "Error fetching seats", error: err.message });
  }
};


async function patchMissingLabels() {
  const events = await Event.find({});
  for (const event of events) {
    let updated = false;

    event.seats = event.seats.map((seat) => {
      if (!seat.label && seat.row && seat.number != null) {
        seat.label = `${seat.row}${seat.number}`;
        updated = true;
      }
      return seat;
    });

    if (updated) {
      console.log(`🛠 Fixing labels in event: ${event.title}`);
      await event.save();
    }
  }

  console.log("✅ Seat label patch completed");
}

patchMissingLabels();


module.exports = {
  createTicket,
  getTickets,
  addSeatsToEvent,
  getSeatsByEvent,
};
