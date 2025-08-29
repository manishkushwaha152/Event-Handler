import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import "@/styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(`/auth/${role}/login`, { email, password });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("role", role);

      if (role === "user") navigate("/user/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
    } catch (err) {
      setError("❌ Invalid credentials or server error");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 {role === "user" ? "User" : "Owner"} Login</h2>

      <form onSubmit={handleLogin}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
