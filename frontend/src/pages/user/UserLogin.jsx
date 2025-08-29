import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // 👈 import GoogleLogin
import api from "@/utils/api";
import "@/styles/UserAuth.css";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/user/login", formData);
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("userId", res.data.user._id);
      alert("✅ Login successful!");
      navigate(redirect);
    } catch (err) {
      console.error("Login Error:", err);
      alert("❌ Login failed: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Send token to backend
      const res = await api.post("/auth/user/google-login", { token });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("userId", res.data.user._id);

      alert("✅ Google Login successful!");
      navigate(redirect);
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("❌ Google login failed");
    }
  };

  return (
    <div className="login-page-bg">
      <div className="auth-container">
        <h2 className="auth-title">User Login</h2>

        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social Logins */}
        <div className="social-login">
          <p className="social-text">or sign in with</p>
          <div className="social-buttons">
            {/* ✅ Replace manual button with GoogleLogin */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("❌ Google Login Failed")}
            />

            <button type="button" className="social-button facebook">
              <img
                src="https://img.icons8.com/color/16/000000/facebook-new.png"
                alt="Facebook"
              />
              Login in with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
