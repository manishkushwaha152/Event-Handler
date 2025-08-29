import { Link } from "react-router-dom";
import "@/styles/OwnerDashboard.css";

export default function OwnerDashboard() {
  return (
    <div className="owner-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-grid">

        <Link to="/create-event">
          <button>Create Event</button>
        </Link>

        <Link to="/owner/create-ticket">
          <button>🎟️ Create Ticket for Event</button>
        </Link>

        <Link to="/owner/event">
          <button>📋 All Events</button>
        </Link>

        <Link to="/owner/manage-event">
          <button>🛠 Manage Events</button>
        </Link>

        <Link to="/owner/ticket">
          <button>🎫 Manage Tickets</button>
        </Link>

        <Link to="/owner/booking">
          <button>📖 View Bookings</button>
        </Link>

        <Link to="/event/123">
          <button>🔍 Event Details (Example)</button>
        </Link>

      </div>
    </div>
  );
}
