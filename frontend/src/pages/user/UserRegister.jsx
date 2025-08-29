import { useState } from "react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import "@/styles/UserAuth.css";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format");
      return false;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Mobile number must be 10 digits");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;

      const res = await api.post("/auth/user/register", dataToSend);
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("role", "user");

      setShowModal(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration Error:", err);
      alert("❌ Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>
      <button onClick={toggleDarkMode} className="toggle-dark-btn">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h2 className="auth-title">User Registration</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="auth-input"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          name="mobile"
          type="text"
          placeholder="Mobile (10 digits)"
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          className="auth-input"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="social-login">
  <p className="social-text">or sign up with</p>
  <div className="social-buttons">
    <button type="button" className="social-button google">
      <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
      Sign up with Google
    </button>
    
  </div>
</div>
      {showModal && (
        <div className="modal success">
          <p>Registration successful!</p>
          <p>Redirecting to Login ...</p>
        </div>
      )}
    </div>
    </div>
  );
}
