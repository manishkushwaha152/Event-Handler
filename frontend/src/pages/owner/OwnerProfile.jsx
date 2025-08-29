import { useState, useEffect } from "react";
import api from "@/utils/api";
import "../../index.css";

export default function OwnerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    organization: "",
  });

  // ✅ Fetch owner profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("ownerToken"); // or use auth context
        const res = await api.get("/owner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("ownerToken");
      await api.put("/owner/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed!");
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="title">Owner Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          required
        />

        <label>Organization:</label>
        <input
          type="text"
          name="organization"
          value={profile.organization}
          onChange={handleChange}
        />

        <button type="submit" className="update-btn">Update Profile</button>
      </form>
    </div>
  );
}
