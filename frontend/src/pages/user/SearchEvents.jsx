import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api";
import "@/styles/SearchEvents.css";

export default function SearchEvents() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/event/public");
        setEvents(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    setQuery(keyword);

    const results = events.filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const city = event.city?.toLowerCase() || "";
      return title.includes(keyword) || city.includes(keyword);
    });

    setFiltered(results);
  };

  return (
    <div className="book-ticket">
    <div className="search-events-container">
      <h2>🔍 Search Events</h2>

      <input
        type="text"
        placeholder="Search by title or city..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="event-results-grid">
        {filtered.length === 0 ? (
          <p>No matching events found.</p>
        ) : (
          filtered.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={`http://localhost:5000/${event.image}`}
                alt={event.title}
                className="event-image"
              />
              <h3>{event.title}</h3>
              <p> {event.city || "Unknown City"}</p>
              <p>🗓 {new Date(event.date).toDateString()}</p>
              <Link to={`/event/${event._id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
