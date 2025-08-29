import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/utils/api";
import "@/styles/OwnerAuth.css"; // Make sure this path is correct

export default function OwnerLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/owner/login", formData);
      const { token, owner } = res.data;

      localStorage.setItem("ownerToken", token);
      localStorage.setItem("role", "owner");
      localStorage.setItem("ownerId", owner._id);

      alert("✅ Login successful!");
      navigate(redirect); // Redirect to previous route or home
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert("❌ Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="auth-input"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="auth-input"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login as Owner"}
        </button>
      </form>
    </div>
  );
}
