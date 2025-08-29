import { useEffect, useState } from "react";
import api from "@/utils/api";
import "@/styles/BookEventTicket.css";
import { useNavigate } from "react-router-dom";

export default function BookEventTicket() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const upiID = "yourname@okaxis";

  useEffect(() => {
    setQuantity(selectedSeats.length);
  }, [selectedSeats]);

  useEffect(() => {
    api
      .get("/event/public")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      const currentPath = window.location.pathname;
      alert("Please login to book an event.");
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      setTickets([]);
      setSeats([]);
      setTicketType("");
      return;
    }

    api
      .get("/tickets", { params: { eventId: selectedEvent } })
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Error fetching tickets", err));

    api
      .get(`/tickets/event/${selectedEvent}/seats`)
      .then((res) => {
        setSeats(res.data);
      })
      .catch((err) => console.error("Error fetching seats", err));
  }, [selectedEvent]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const selectedTicket = tickets.find((t) => t.type === ticketType);
  const unitPrice = selectedTicket?.price || 0;
  const totalPrice = unitPrice * quantity;

  const handleShowQR = () => {
    setQrImage("/qr.png");
    setShowQR(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const seatPayload = selectedSeats.map((id) => {
        const seat = seats.find((s) => s._id === id);
        return {
          seatId: seat._id,
          row: seat.row,
          number: seat.number,
          category: seat.category,
          label: seat.label || `${seat.row}${seat.number}`, // ✅ FIXED
        };
      });

      await api.post(
        "/bookings",
        {
          eventId: selectedEvent,
          ticketType,
          quantity,
          seats: seatPayload,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      setSelectedEvent("");
      setTicketType("");
      setQuantity(0);
      setShowQR(false);
      setPaymentConfirmed(false);
      setSelectedSeats([]);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.response?.data?.message || "server error"));
    }
  };

  const filteredSeats = seats.filter((seat) => seat.category === ticketType);
  const rows = [...new Set(filteredSeats.map((seat) => seat.row))];

  return (
    <div className="book-ticket-bg">
    <div className="book-ticket-container">
      <h2 className="book-ticket-title">🎟 Book Event Ticket</h2>
      <div className="book-ticket-form">
        {/* Step 1: Event & Ticket Selection */}
        <h3 className="section-heading">Step 1: Select Event & Ticket</h3>
        <select
          className="book-ticket-select"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>

        <select
          className="book-ticket-select"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          disabled={!tickets.length}
        >
          <option value="">Select Ticket Type</option>
          {tickets.map((t) => (
            <option key={t._id} value={t.type}>
              {t.type} — ₹{t.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="book-ticket-input"
          min="1"
          value={quantity}
          readOnly
        />

        {ticketType && (
          <div className="ticket-preview">
            <p><strong>Unit Price:</strong> ₹{unitPrice}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Total:</strong> ₹{totalPrice}</p>
          </div>
        )}

        {/* Step 2: Seat Selection */}
        {ticketType && (
          <>
            <h3 className="section-heading">Step 2: Select Your Seats ({ticketType})</h3>
            {filteredSeats.length ? (
              <div className="seat-grid">
                {rows.map((row) => (
                  <div className="seat-row" key={row}>
                    <span className="row-label">{row}</span>
                    {filteredSeats
                      .filter((seat) => seat.row === row)
                      .map((seat) => (
                        <div
                          key={seat._id}
                          className={`seat ${
                            selectedSeats.includes(seat._id) ? "selected" : ""
                          } ${seat.status === "booked" ? "booked" : "available"}`}
                          onClick={() =>
                            seat.status === "available" && toggleSeat(seat._id)
                          }
                        >
                          {seat.label}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-seats-message">
                😕 No available seats in {ticketType} category.
              </p>
            )}
            <p>🪑 Seats Selected: {selectedSeats.length}</p>

            {/* Legend */}
            <div className="seat-legend">
              <span>
                <div className="seat available" /> Available
              </span>
              <span>
                <div className="seat selected" /> Selected
              </span>
              <span>
                <div className="seat booked" /> Booked
              </span>
            </div>
          </>
        )}

        {/* Step 3: QR Payment */}
        {!showQR && ticketType && selectedSeats.length > 0 && (
          <>
            <h3 className="section-heading">Step 3: Pay via UPI</h3>
            <button
              className="book-ticket-button"
              onClick={handleShowQR}
              disabled={
                !selectedEvent || !ticketType || selectedSeats.length === 0
              }
            >
              Show QR & Pay ₹{totalPrice}
            </button>
          </>
        )}

        {/* Step 4: Payment Confirmation */}
        {showQR && (
          <>
            <div className="qr-code-box">
              <p>
                <strong>Scan QR with PhonePe / GPay</strong>
              </p>
              <img src={qrImage} alt="UPI QR Code" />
              <p>
                Pay ₹{totalPrice} to: <strong>{upiID}</strong>
              </p>
              <button
                className="confirm-payment-btn"
                onClick={() => setPaymentConfirmed(true)}
              >
                ✅ I've Paid
              </button>
            </div>
          </>
        )}

        {/* Step 5: Confirm Booking */}
        {paymentConfirmed && (
          <>
            <h3 className="section-heading">Step 4: Confirm Booking</h3>
            <button className="book-ticket-button" onClick={handleConfirmBooking}>
              Confirm Booking 🎉
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal success">
          <p>🎉 Ticket booked successfully!</p>
        </div>
      )}
    </div>
    </div>
  );
}
