const Booking = require("../../models/bookingModel");
const Event = require("../../models/eventModel");
const Ticket = require("../../models/ticketModel");
const QRCode = require("qrcode");
const generateTicketPDF = require("../../utils/generateTicketPDF");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, seats } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(seats) || seats.length !== quantity) {
      return res
        .status(400)
        .json({ message: `Select exactly ${quantity} seat(s)` });
    }

    const seatIds = seats.map((s) => s.seatId);
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const ticket = await Ticket.findOne({ eventId, type: ticketType });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.availableQuantity < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const matchedSeats = event.seats.filter(
      (seat) =>
        seatIds.includes(seat._id.toString()) &&
        seat.status === "available" &&
        seat.category.toLowerCase() === ticketType.toLowerCase()
    );

    if (matchedSeats.length !== quantity) {
      return res.status(400).json({
        message: "Some selected seats are already booked or invalid",
      });
    }

    // Mark booked
    event.seats = event.seats.map((seat) => {
      if (seatIds.includes(seat._id.toString())) {
        return {
          ...seat.toObject(),
          status: "booked",
          label: seat.label || `${seat.row}${seat.number}`,
        };
      }
      return seat;
    });
    await event.save();

    ticket.availableQuantity -= quantity;
    await ticket.save();

    const updatedSeats = matchedSeats.map((seat) => ({
      seatId: seat._id,
      row: seat.row,
      number: seat.number,
      category: seat.category,
      label: seat.label || `${seat.row}${seat.number}`,
    }));

    const totalAmount = ticket.price * quantity;

    // ✅ Generate QR Code
    const qrData = `Event: ${event.title}\nType: ${ticketType}\nQty: ${quantity}\nSeats: ${updatedSeats
      .map((s) => s.label)
      .join(", ")}`;
    const qrImage = await QRCode.toDataURL(qrData);

    // ✅ Create booking in DB
    const booking = await Booking.create({
      userId,
      eventId,
      ticketType,
      quantity,
      totalAmount,
      seats: updatedSeats,
      qrCode: qrImage,
    });

    // ✅ Send confirmation email with PDF
    const user = await User.findById(userId);
    if (user?.email) {
      const seatList = updatedSeats.map((s) => s.label).join(", ");
      const html = `
        <h2>🎟 Booking Confirmation</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Thank you for booking <strong>${quantity}</strong> ticket(s) for <strong>${event.title}</strong>.</p>
        <p><strong>Ticket Type:</strong> ${ticketType}</p>
        <p><strong>Total:</strong> ₹${totalAmount}</p>
        <p><strong>Seats:</strong> ${seatList}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <br/>
        <p>📎 Your ticket PDF is attached below.</p>
        <p>Enjoy the event! 🎉</p>
      `;

      const pdfBuffer = await generateTicketPDF({
        event,
        user,
        seats: updatedSeats,
        qrImage,
        quantity,
        totalAmount,
        ticketType,
      });

      await sendEmail({
        to: user.email,
        subject: `✅ Booking Confirmed: ${event.title}`,
        html,
        attachments: [
          {
            filename: "Ticket.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res.status(500).json({ message: "Booking failed" });
  }
};



exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    const ticket = await Ticket.findOne({
      eventId: booking.eventId,
      type: booking.ticketType,
    });
    if (ticket) {
      ticket.availableQuantity += booking.quantity;
      await ticket.save();
    }

    const event = await Event.findById(booking.eventId);
    if (event && Array.isArray(booking.seats)) {
      const bookedSeatIds = booking.seats.map((s) => s?.seatId?.toString()).filter(Boolean);
      event.seats = event.seats.map((seat) => {
        if (bookedSeatIds.includes(seat._id.toString())) {
          return { ...seat.toObject(), status: "available" };
        }
        return seat;
      });
      await event.save();
    }

    booking.status = "canceled";
    await booking.save();

    res.json({ message: "Booking canceled successfully" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ message: "Server error while canceling booking" });
  }
};


// 📄 Generate Ticket PDF (for download)
exports.downloadTicketPDF = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("eventId")
      .populate("userId");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { eventId: event, userId: user, seats, ticketType, quantity, totalAmount, qrCode } = booking;

    const pdfBuffer = await generateTicketPDF({
      event,
      user,
      seats,
      qrImage: qrCode,
      quantity,
      totalAmount,
      ticketType,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Ticket-${event.title}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF download error:", err.message);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

// 👤 Get User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("eventId", "title city date")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      eventTitle: b.eventId?.title || "N/A",
      city: b.eventId?.city || "N/A",
      date: b.eventId?.date || null,
      ticketType: b.ticketType,
      quantity: b.quantity,
      totalAmount: b.totalAmount,
      qrCode: b.qrCode,
      status: b.status || "confirmed",
      seats: b.seats,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ User booking fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// 📊 Admin/Owner: Get Event Bookings
exports.getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await Booking.find({ eventId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Event booking fetch error:", err.message);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
