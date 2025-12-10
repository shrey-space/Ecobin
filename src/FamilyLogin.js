import React, { useState } from "react";
import axios from "axios";
import "./FamilyLogin.css";

function FamilyLogin() {
  const [roomNo, setRoomNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/family/login", {
        roomNo,
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Save family & society data to localStorage
        localStorage.setItem("family", JSON.stringify(res.data.family));
        localStorage.setItem("society", JSON.stringify(res.data.society));

        // ✅ Save role & userId (family id)
        localStorage.setItem("role", "family");
        localStorage.setItem("userId", res.data.family._id);

        // Redirect to society home
        window.location.href = "/societyhome";
      } else {
        setError("Invalid login details");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="family-login">
      <h2>Family Login</h2>
      <input
        type="text"
        placeholder="Room No"
        value={roomNo}
        onChange={(e) => setRoomNo(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (Secret Code)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}

export default FamilyLogin;
