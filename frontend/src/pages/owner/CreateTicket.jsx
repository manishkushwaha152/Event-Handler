import { useEffect, useState } from "react";
import api from "@/utils/api";
import "@/styles/CreateTicket.css";
import { toast } from "react-toastify";

export default function CreateTicket() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    eventId: "",
    type: "VIP",
    price: "",
    availableQuantity: "",
    rows: "A",
    startNumber: 1,
    endNumber: 10,
    seatPrice: 0,
  });

  // Fetch owner events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("ownerToken");
        const res = await api.get("/event/owner-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  // Auto set seat price and quantity
  useEffect(() => {
    const rowCount = form.rows.split(",").filter(Boolean).length;
    const seatCount =
      rowCount * (parseInt(form.endNumber || 0) - parseInt(form.startNumber || 0) + 1);
    setForm((prev) => ({
      ...prev,
      seatPrice: prev.price,
      availableQuantity: seatCount,
    }));
  }, [form.price, form.rows, form.startNumber, form.endNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateSeats = () => {
    const seatList = [];
    const rows = form.rows.split(",").map((r) => r.trim().toUpperCase());
    for (let row of rows) {
      for (
        let i = parseInt(form.startNumber);
        i <= parseInt(form.endNumber);
        i++
      ) {
        seatList.push({
  row,
  number: i,
  category: form.type,
  price: parseFloat(form.seatPrice),
  status: "available", // ✅ explicitly add status
});

      }
    }
    return seatList;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.eventId ||
      !form.type ||
      !form.price ||
      !form.rows ||
      !form.startNumber ||
      !form.endNumber
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const seats = generateSeats();

    try {
      const token = localStorage.getItem("ownerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Create Ticket
      await api.post(
        "/tickets",
        {
          eventId: form.eventId,
          type: form.type,
          price: form.price,
          availableQuantity: form.availableQuantity,
        },
        config
      );

      // 2. Add Seats to Event (🔁 FIXED endpoint path)
      await api.post(`/tickets/add-seats/${form.eventId}`, { seats }, config);


      toast.success("✅ Ticket & Seats created!");

      // Show preview
      setPreview({
        event: events.find((e) => e._id === form.eventId)?.title,
        ...form,
        seatCount: seats.length,
        seats,
      });

      // Reset form
      setForm({
        eventId: "",
        type: "VIP",
        price: "",
        availableQuantity: "",
        rows: "A",
        startNumber: 1,
        endNumber: 10,
        seatPrice: 0,
      });

      setActiveTab("preview");
    } catch (err) {
      console.error("Submission error", err);
      toast.error("❌ Failed to create ticket/seats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Create Ticket & Seats</h2>

      <div className="tabs">
        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => setActiveTab("form")}
        >
          🎟 Ticket + Seats
        </button>
        <button
          className={activeTab === "preview" ? "active" : ""}
          onClick={() => setActiveTab("preview")}
        >
          👁️ Preview
        </button>
      </div>

      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="slide-form">
          <select
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="VIP">VIP</option>
            <option value="General">General</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="rows"
            placeholder="Rows (e.g. A,B,C)"
            value={form.rows}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="startNumber"
            placeholder="Start Seat Number"
            value={form.startNumber}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="endNumber"
            placeholder="End Seat Number"
            value={form.endNumber}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="seatPrice"
            placeholder="Seat Price"
            value={form.seatPrice}
            readOnly
          />

          <input
            type="number"
            name="availableQuantity"
            placeholder="Auto Quantity"
            value={form.availableQuantity}
            readOnly
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket & Seats"}
          </button>
        </form>
      )}

      {activeTab === "preview" && preview && (
        <div className="preview">
          <h4>🎉 Ticket Created</h4>
          <p>
            <strong>Event:</strong> {preview.event}
          </p>
          <p>
            <strong>Type:</strong> {preview.type}
          </p>
          <p>
            <strong>Price:</strong> ₹{preview.price}
          </p>
          <p>
            <strong>Quantity:</strong> {preview.availableQuantity}
          </p>
          <p>
            <strong>Rows:</strong> {preview.rows}
          </p>
          <p>
            <strong>Seats:</strong> {preview.seatCount} total
          </p>

          <ul className="preview-seats">
            {preview.seats.map((s, i) => (
              <li key={i}>
                {s.row}
                {s.number} - ₹{s.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
