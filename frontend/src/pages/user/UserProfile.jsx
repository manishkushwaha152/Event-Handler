import { useEffect, useRef, useState } from "react";
import "@/styles/UserProfile.css"; // 👈 CSS file (same rahega)

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const avatarRef = useRef(null);

  // (A) Close on outside click
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

  // (B) Close on Esc
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  // Dummy user – apne auth state/API se replace kar lo
  const user = {
    name: "Manish Kushwaha",
    email: "manish@example.com",
    avatar: "manish.jpg",
  };

  return (
    <>
      {/* Profile Image (jo click hoga to panel open hoga) */}
      <img
        ref={avatarRef}
        className="nav-avatar"
        src={user.avatar}
        alt="Profile"
        onClick={() => setOpen((v) => !v)}
      />

      {/* Overlay */}
      {open && <div className="profile-overlay" onClick={() => setOpen(false)} />}

      {/* Right Slide Panel */}
      <aside
        ref={panelRef}
        className={`profile-panel ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="panel-header">
          <img className="panel-avatar" src={user.avatar} alt="User" />
          <div className="panel-user">
            <div className="panel-name">{user.name}</div>
            <div className="panel-email">{user.email}</div>
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
          <button
            className="panel-btn danger"
            onClick={() => alert("Logged out")}
          >
            <span className="icon">↪</span>
            Logout
          </button>
        </div>

        <div className="panel-footer">
          <button className="manage-btn" onClick={() => alert("Manage account")}>
            Manage your account
          </button>
        </div>
      </aside>
    </>
  );
}
