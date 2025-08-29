import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/UserDashboard.css";

export default function UserDashboard() {
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/user/UserLogin");
  };

  return (
    <div className="user-dashboard-container">
      <h1 className="dashboard-title">Welcome, {userName} 🎉</h1>

      <div className="dashboard-buttons">
        <button onClick={() => navigate("/user/book/event-ticket")}> Book Ticket</button>
        <button onClick={() => navigate("/user/bookings")}> View Bookings</button>
        <button onClick={() => navigate("/user/search")}> Search Events</button>
        <button onClick={handleLogout} className="logout-btn"> Logout</button>
      </div>
    </div>
  );
}
