import { useEffect, useRef, useState } from "react";
import api from "@/utils/api"; // 👈 axios instance (baseURL + token setup)
import "@/styles/UserProfile.css";

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); // 👈 backend से आने वाला user
  const panelRef = useRef(null);
  const avatarRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get("/user/profile");
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    }
    fetchUser();
  }, []);

  // Outside click close
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      const inPanel = panelRef.current?.contains(e.target);
      const onAvatar = avatarRef.current?.contains(e.target);
      if (!inPanel && !onAvatar) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  if (!user) return null; // 👈 jab tak data load nahi hota

  return (
    <>
      <img
        ref={avatarRef}
        className="nav-avatar"
        src={user.avatar || "/default-avatar.png"}
        alt="Profile"
        onClick={() => setOpen((v) => !v)}
      />

      {open && <div className="profile-overlay" onClick={() => setOpen(false)} />}

      <aside
        ref={panelRef}
        className={`profile-panel ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="panel-header">
          <img
            className="panel-avatar"
            src={user.avatar || "/default-avatar.png"}
            alt="User"
          />
          <div className="panel-user">
            <div className="panel-name">{user.name}</div>
            <div className="panel-email">{user.email}</div>
            <div className="panel-role">{user.role}</div>
          </div>
        </div>

        <div className="panel-actions">
          <button className="panel-btn" onClick={() => alert("Go to profile")}>
            <span className="icon">👤</span>
            My Profile
          </button>
          <button className="panel-btn" onClick={() => alert("Open settings")}>
            <span className="icon">⚙️</span>
            Settings
          </button>

          {/* ✅ Role-based options */}
          {user.role === "owner" ? (
            <button
              className="panel-btn"
              onClick={() => (window.location.href = "/owner/manage-events")}
            >
              <span className="icon">📊</span>
              Manage Events
            </button>
          ) : (
            <button
              className="panel-btn"
              onClick={() => (window.location.href = "/user/bookings")}
            >
              <span className="icon">🎟</span>
              My Bookings
            </button>
          )}

          <button
            className="panel-btn danger"
            onClick={() => {
              localStorage.removeItem("token"); // logout
              window.location.href = "/login";
            }}
          >
            <span className="icon">↪</span>
            Logout
          </button>
        </div>

        <div className="panel-footer">
          <button
            className="manage-btn"
            onClick={() => alert("Manage account")}
          >
            Manage your account
          </button>
        </div>
      </aside>
    </>
  );
}
