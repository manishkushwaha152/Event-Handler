import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import "@/styles/OwnerAuth.css";

export default function OwnerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/owner/register", formData);
      console.log("Owner registered:", res.data);
      alert("Admin registration successful!");

      // ✅ Redirect to login page
      navigate("/owner/login");

    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="auth-container">
      <h2 className="auth-title">Admin Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="auth-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
