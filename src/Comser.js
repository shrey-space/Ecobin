import React, { useState } from "react";
import "./Comser.css";

const Comser = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    wasteType: "",
    wasteQuantity: "",
    pickupDate: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Commercial Service Request:", formData);
    alert("Your commercial service request has been submitted!");
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      wasteType: "",
      wasteQuantity: "",
      pickupDate: "",
      message: ""
    });
  };

  return (
    <div className="comser-container">
      {/* Left Section: Image or Banner */}
      <div className="comser-left">
        <img
          src="https://images.unsplash.com/photo-1581579188871-45ea61f2a0c2?auto=format&fit=crop&w=900&q=80"
          alt="Commercial Waste"
          className="comser-image"
        />
      </div>

      {/* Right Section: Form */}
      <div className="comser-right">
        <h2 className="comser-title">🏢 Commercial Waste Service</h2>
        <p className="comser-subtitle">
          Register your business for regular waste collection and recycling.
        </p>

        <form className="comser-form" onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label>Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
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

          <label>Company Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>

          <label>Waste Type</label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            required
          >
            <option value="">Select Waste Type</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Metal">Metal</option>
            <option value="Glass">Glass</option>
            <option value="E-Waste">E-Waste</option>
          </select>

          <label>Waste Quantity (in kg)</label>
          <input
            type="number"
            name="wasteQuantity"
            value={formData.wasteQuantity}
            onChange={handleChange}
            required
          />

          <label>Preferred Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
          />

          <label>Additional Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="2"
          ></textarea>

          <button type="submit" className="comser-btn">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default Comser;
