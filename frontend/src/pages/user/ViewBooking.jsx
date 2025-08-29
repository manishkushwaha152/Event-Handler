import { useEffect, useState } from "react";
import api from "@/utils/api";
import "@/styles/ViewBooking.css";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ViewBooking() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bookingsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    api
      .get("/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.filter((b) => b.eventTitle);
        setBookings(data);
        setFiltered(data);
        const uniqueEvents = [...new Set(data.map((b) => b.eventTitle || "Untitled"))];
        setEvents(uniqueEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Booking fetch error:", err);
        setError("Failed to load bookings");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredData = [...bookings];
    if (eventFilter) {
      filteredData = filteredData.filter((b) => b.eventTitle === eventFilter);
    }
    if (typeFilter) {
      filteredData = filteredData.filter((b) => b.ticketType === typeFilter);
    }
    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      filteredData = filteredData.filter((b) => {
        const bookingDate = new Date(b.date);
        return bookingDate >= from && bookingDate <= to;
      });
    }
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [eventFilter, typeFilter, dateRange, bookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("userToken");
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setFiltered((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Cancel failed");
    }
  };

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / bookingsPerPage);

  const downloadQR = (base64, title) => {
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => saveAs(blob, `${title}_QR.png`));
  };

  const downloadTicketPDF = (b) => {
    const doc = new jsPDF();

    const {
      eventTitle,
      city,
      date,
      ticketType,
      quantity,
      totalAmount,
      qrCode,
      seats,
      status,
    } = b;

    doc.setFontSize(16);
    doc.text(" Event Ticket", 14, 20);

    doc.setFontSize(12);
    doc.text(`Event: ${eventTitle}`, 14, 30);
    doc.text(`City: ${city}`, 14, 38);
    doc.text(`Date: ${date ? new Date(date).toLocaleString() : "N/A"}`, 14, 46);
    doc.text(`Ticket Type: ${ticketType}`, 14, 54);
    doc.text(`Quantity: ${quantity}`, 14, 62);
    doc.text(`Seats: ${seats.map((s) => s.label).join(", ")}`, 14, 70);
    doc.text(`Total Amount: ₹${totalAmount}`, 14, 78);
    doc.text(`Status: ${status || "confirmed"}`, 14, 86);

    if (qrCode) {
      doc.addImage(qrCode, "PNG", 140, 20, 50, 50);
    }

    doc.save(`${eventTitle.replace(/\s+/g, "_")}_ticket.pdf`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Bookings", 14, 10);
    autoTable(doc, {
      head: [["Event", "Date", "Ticket Type", "Qty", "Status"]],
      body: filtered.map((b) => [
        b.eventTitle || "Untitled",
        b.date ? new Date(b.date).toLocaleDateString() : "N/A",
        b.ticketType,
        b.quantity,
        b.status || "confirmed",
      ]),
    });
    doc.save("bookings.pdf");
  };

  if (loading) {
    return <div className="loading">⏳ Loading bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="booking-wrapper">
    <div className="view-bookings-container">
      <h2>📄 Your Bookings</h2>

      <div className="filter-section">
        <select onChange={(e) => setEventFilter(e.target.value)} value={eventFilter}>
          <option value="">All Events</option>
          {events.map((ev, idx) => (
            <option key={idx} value={ev}>
              {ev}
            </option>
          ))}
        </select>

        <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
          <option value="">All Types</option>
          <option value="VIP">VIP</option>
          <option value="General">General</option>
        </select>

        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))}
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))}
        />

        <CSVLink filename="bookings.csv" data={filtered} className="export-btn">
          📅 Export CSV
        </CSVLink>
        <button className="export-btn" onClick={exportPDF}>
          📄 Export PDF
        </button>
      </div>

      <div className="booking-list">
        {currentBookings.length === 0 && <p>No bookings found.</p>}
        {currentBookings.map((b) => (
          <div key={b._id} className="booking-card">
            <div className="card-header">
              <h4>{b.eventTitle || "Untitled"}</h4>
              <span className={`status ${b.status || "confirmed"}`}>
                {b.status === "canceled" ? "❌ Canceled" : "✅ Confirmed"}
              </span>
            </div>
            <p><strong>City:</strong> {b.city || "N/A"}</p>
            <p><strong>Date:</strong> {b.date ? new Date(b.date).toLocaleDateString() : "N/A"}</p>
            <p><strong>Ticket:</strong> {b.ticketType} × {b.quantity}</p>

            <div className="seat-tags">
              {b.seats?.map((s, i) => (
                <span key={i} className="seat-tag">{s.label}</span>
              ))}
            </div>

            {b.qrCode && (
              <div className="qr-section">
                <img src={b.qrCode} alt="QR Code" />
                <button onClick={() => downloadQR(b.qrCode, b.eventTitle || "event")}>
                  🖼️ Download QR
                </button>
                <button onClick={() => downloadTicketPDF(b)}>
                  📄 Download PDF
                </button>
              </div>
            )}

            {b.status !== "canceled" && (
              <button className="cancel-btn" onClick={() => handleCancel(b._id)}>
                🔴 Cancel
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      
    </div>
    </div>
  );
}
