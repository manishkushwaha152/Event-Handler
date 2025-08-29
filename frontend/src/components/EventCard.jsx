import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";
import { BASE_URL } from "@/utils/constants";

export default function EventCard({ event }) {
  const {
    _id,

   title,
    image,
    area = "Unknown Area",
    city = "Unknown City",
    date,
    price = "N/A",
  } = event;

  const src = image
    ? `${BASE_URL}/uploads/${image}`
    : "/placeholder.png";

  return (
    <div className="event-card">
      <img
        src={src}
        alt={title}
        className="event-image"
        onError={(e) => (e.target.src = "/placeholder.png")}
      />
      <div className="event-info">
-       <h3 className="event-name">{name}</h3>
+       <h3 className="event-name">{title}</h3>
        <p className="event-location">📍 {area}, {city}</p>
        <p className="event-date">
          📅 {date ? new Date(date).toLocaleDateString("en-IN") : "TBD"}
        </p>
        <p className="event-price">💰 ₹{price}</p>
        <Link to={`/event/${_id}`} className="view-button">
          View Details →
        </Link>
      </div>
    </div>
  );
}
