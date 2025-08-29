import { useEffect, useState } from "react";
import api from "@/utils/api";
import "@/styles/OwnerEvents.css"; // optional CSS file

export default function OwnerEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/event"); // auth token sent automatically
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div className="owner-events-container">
      <h2>My Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event._id}>
              <img
  src={`http://localhost:5000/${event.image}`}
  alt={event.title}
  className="event-image"
/>

              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {event.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
