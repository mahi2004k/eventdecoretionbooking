import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", border: "1px solid #cbd5e1", borderRadius: "12px", background: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#0f172a" }}>🔑 Admin Login</h2>
      {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600", fontSize: "14px", color: "#334155" }}>Username:</label>
          <input 
            type="text" 
            name="username" 
            required 
            value={credentials.username} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #cbd5e1" }} 
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "600", fontSize: "14px", color: "#334155" }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            required 
            value={credentials.password} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #cbd5e1" }} 
          />
        </div>

        <button 
          type="submit" 
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
        >
          Login to Dashboard
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;