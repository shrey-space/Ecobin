// reclogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reclogin.css"; // optional for styling

const RecLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Call backend login API
      const res = await fetch("http://localhost:5001/api/recyclers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Recycler Login Successful ✅");
        // redirect with recycler data
        navigate("/recyclehome", { state: { recycler: data.data } });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="reclogin-container">
      <h2>♻️ Recycler Login</h2>
      <form onSubmit={handleSubmit} className="reclogin-form">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default RecLogin;
