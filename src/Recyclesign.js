import React, { useState } from "react";
import "./Recyclesign.css";
import recycleImg from "./assets/images/OIP.jpg";

const Recyclesign = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    gstNumber: "",
    licenseNumber: "",
    address: "",
    wasteTypes: [],
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedWasteTypes = checked
          ? [...prev.wasteTypes, value]
          : prev.wasteTypes.filter((item) => item !== value);
        return { ...prev, wasteTypes: updatedWasteTypes };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("⚠️ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/recycler/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage(data.message);
        setFormData({
          companyName: "",
          email: "",
          phone: "",
          gstNumber: "",
          licenseNumber: "",
          address: "",
          wasteTypes: [],
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.message || "❌ Registration failed");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      setLoading(false);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="recycle-container">
      {/* Left Half - Image */}
      <div className="recycle-left">
        <img src={recycleImg} alt="Recycling" className="recycle-image" />
      </div>

      {/* Right Half - Form */}
      <div className="recycle-right">
        <h2 className="form-title">♻️ Recycler Registration</h2>
        <form onSubmit={handleSubmit} className="recycle-form">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
          />

          <label>License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />

          <label>Company Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>

          <label>Preferred Waste Types</label>
          <div className="checkbox-group">
            {["Plastic", "Paper", "Glass", "Metal", "Organic"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type}
                  checked={formData.wasteTypes.includes(type)}
                  onChange={handleChange}
                />{" "}
                {type}
              </label>
            ))}
          </div>

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Recyclesign;
