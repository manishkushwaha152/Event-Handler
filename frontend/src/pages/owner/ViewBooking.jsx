// src/owner/ViewBooking.jsx
import React, { useState, useEffect } from "react";
import "@/index.css";
import api from "@/utils/api";

export default function ViewBooking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("ownerToken"); // if required
        const res = await api.get("/owner/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        alert("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="view-booking-container">
      <h2 className="view-booking-title">Event Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3>{booking.eventName}</h3>
            <p><strong>Booked By:</strong> {booking.userName}</p>
            <p><strong>Ticket:</strong> {booking.ticketType}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
            <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
