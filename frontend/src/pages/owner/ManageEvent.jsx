import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BookingChartModal from "./BookingChartModal";
import "@/styles/ManageEvent.css";

export default function ManageEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/event");
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/event/${eventId}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Delete failed");
      console.error(" Delete Error:", err.response?.data || err.message);
    }
  };

  const isInRange = (dateStr) => {
    const eventDate = new Date(dateStr);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    return (!from || eventDate >= from) && (!to || eventDate <= to);
  };

  const filteredEvents = events.filter((e) => {
    const matchesStatus = filter === "all" || e.status === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = isInRange(e.date);
    return matchesStatus && matchesSearch && matchesDate;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const exportToCSV = () => {
    const headers = ["Title", "Date", "Status", "Bookings"];
    const rows = sortedEvents.map((e) => [
      e.title,
      new Date(e.date).toLocaleDateString(),
      e.status,
      e.bookings?.length || 0,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "events.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="manage-events">
      <h2>Manage Events</h2>

      <div className="filter">
        <label>Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="date-range">
        <label>From:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>

      <div className="event-list">
        {sortedEvents.map((event) => (
          <div key={event._id} className="event-card">
            {event.image && (
  <img
                src={`http://localhost:5000/${event.image}`}
                alt={event.title}
                className="event-image"
              />
)}        <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p>
              <span className={`status-badge ${event.status}`}>{event.status}</span>
            </p>
            <p><strong>Bookings:</strong> {event.bookings?.length || 0}</p>

            <div className="actions">
              <button onClick={() => navigate(`/owner/event/${event._id}/edit`)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
              <button onClick={() => setSelectedEvent(event)}>View Chart</button>
            </div>
          </div>
        ))}
      </div>

      <BookingChartModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
