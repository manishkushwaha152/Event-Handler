import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@/styles/Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 👇 localStorage se role nikal rahe hain (user ya owner)
    const storedRole = localStorage.getItem("role"); 
    setRole(storedRole);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Logo */}
        <h1 className="logo" onClick={() => navigate("/")}>
          EventBooking
        </h1>

        {/* ✅ Nav Links */}
        <ul className="nav-links">
          {role === "user" && (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                
                <Link to="/user/search">Search</Link>
              </li>
               <li>
                <Link to="/user/book/event-ticket">Book Ticket</Link>
              </li>
               <li>
                <Link to="/user/booking">Booking </Link>
              </li>
            </>
          )}

          {role === "owner" && (
            <>
              <li>
                <Link to="/manage-events">Manage Events</Link>
              </li>
              <li>
                <Link to="/create-event">Create Event</Link>
              </li>
              <li>
                <Link to="/tickets">Tickets</Link>
              </li>
              <li>
                <Link to="/seats">Seats</Link>
              </li>
            </>
          )}

          {!role && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>

        {/* ✅ Profile Menu (Only if logged in) */}
        {role && (
          <div className="profile-menu" onClick={toggleDropdown}>
            <img
              src="/default-avatar.png"
              alt="User Avatar"
              className="profile-avatar"
            />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <button onClick={() => navigate("/user-profile")}>
                  UserProfile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
