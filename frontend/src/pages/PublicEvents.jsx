import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Link } from "react-router-dom";
import "@/styles/PublicEvents.css";

export default function PublicEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/event/public")
      .then((res) => {
        const approved = res.data.filter(e => e.status === "approved");
        setEvents(approved);
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="home">
      <div className="public-events">
        <h2>Explore Events</h2>
        <div className="event-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <img
                src={`http://localhost:5000/${event.image}`}
                alt={event.title}
                className="event-image"
              />
              <h3>{event.title}</h3>
              <p>{event.description.slice(0, 100)}...</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <Link to={`/event/${event._id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
