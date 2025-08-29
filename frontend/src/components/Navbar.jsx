import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "@/styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Update role on route change
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const ownerToken = localStorage.getItem("ownerToken");
    const currentRole = localStorage.getItem("role");

    if ((userToken || ownerToken) && currentRole) {
      setRole(currentRole);
    } else {
      setRole("");
    }
  }, [location]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("role");
    localStorage.removeItem("ownerId");
    setRole("");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        🎫 Event Handler
      </div>

      {/* Hamburger icon for mobile */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navbar Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>

        {role === "user" && (
          <>
            <li><Link to="/events" onClick={() => setMenuOpen(false)}>View Events</Link></li>
            <li><Link to="/user/book/event-ticket" onClick={() => setMenuOpen(false)}>Book Event</Link></li>
            <li><Link to="/user/search" onClick={() => setMenuOpen(false)}>Search Event</Link></li>
            <li><Link to="/user/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        )}

        {role === "owner" && (
          <>
            <li><Link to="/owner/event" onClick={() => setMenuOpen(false)}>My Events</Link></li>
            <li><Link to="/create-event" onClick={() => setMenuOpen(false)}>Create Event</Link></li>
            <li><Link to="/owner/create-ticket" onClick={() => setMenuOpen(false)}>Create Ticket</Link></li>
            <li><Link to="/owner/manage-event" onClick={() => setMenuOpen(false)}>Manage Event</Link></li>
            <li><Link to="/owner/view-bookings" onClick={() => setMenuOpen(false)}>View Bookings</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        )}

        {!role && (
          <>
            <li><Link to="/events" onClick={() => setMenuOpen(false)}>View Events</Link></li>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
