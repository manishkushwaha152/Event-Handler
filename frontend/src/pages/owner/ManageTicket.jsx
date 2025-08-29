import { useEffect, useState } from "react";
import "../../index.css";
import api from "@/utils/api";

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);

  // ✅ Fetch tickets for the logged-in owner
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("ownerToken"); // adjust if named differently
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await api.get("/owner/tickets", config);
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
    };
    fetchTickets();
  }, []);

  // ✅ Delete a ticket
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("ownerToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await api.delete(`/tickets/${id}`, config);
      setTickets(tickets.filter((ticket) => ticket._id !== id));
    } catch (err) {
      alert("Failed to delete ticket");
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit logic for ticket ID ${id} goes here`);
    // Example: navigate(`/owner/edit-ticket/${id}`)
  };

  return (
    <div className="manage-tickets-container">
      <h2 className="title">Manage Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.eventName || "Event"}</h3>
              <p><strong>Type:</strong> {ticket.type}</p>
              <p><strong>Price:</strong> ₹{ticket.price}</p>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <div className="button-group">
                <button className="edit-btn" onClick={() => handleEdit(ticket._id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(ticket._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
