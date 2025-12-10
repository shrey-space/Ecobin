import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SocietyLoginPage.css"; // 👈 CSS file

function SocLoginPage() {
  const [societyName, setSocietyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/society-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ societyName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save society data & role to localStorage
        if (data.society && data.society.approved) {
          localStorage.setItem("society", JSON.stringify(data.society));
          localStorage.setItem("role", "society"); // ✅ mark as society login
          localStorage.setItem("userId", data.society._id); // ✅ save society ID

          navigate("/societyhome"); // redirect on success
        } else {
          setError("Your society is not approved yet. Please contact the admin.");
        }
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Image */}
      <div className="login-left">
        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
          alt="Society"
        />
      </div>

      {/* Right Side - Form */}
      <div className="login-right">
        <div className="login-container">
          <h2 className="login-title">Society Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Society Name"
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              required
              className="login-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default SocLoginPage;
