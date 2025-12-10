// SocLogin.js
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./soc_login.css";
import {
  FaBuilding,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaFileUpload,
  FaTrash,
  FaBinoculars,
  FaClipboardCheck,
} from "react-icons/fa";

export default function SocLogin() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    step1: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      idProof: null,
      regCert: null,
    },
    step2: {
      flats: "",
      blueBins: "",
      avgWaste: "",
      receipts: [],
      photos: [],
      declaration: null,
    },
  });

  // Handle input fields
  const handleChange = (e, stepKey, field) => {
    setFormData({
      ...formData,
      [stepKey]: {
        ...formData[stepKey],
        [field]: e.target.value,
      },
    });
  };

  // Handle file inputs
  const handleFileChange = (e, stepKey, field) => {
    const files = e.target.files;
    setFormData({
      ...formData,
      [stepKey]: {
        ...formData[stepKey],
        [field]:
          field === "receipts" || field === "photos"
            ? Array.from(files)
            : files[0],
      },
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Submit handler
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Step 1 fields
      data.append("societyName", formData.step1.name);
      data.append("email", formData.step1.email);
      data.append("phone", formData.step1.phone);
      data.append("password", formData.step1.password);
      data.append("role", formData.step1.role);

      if (formData.step1.idProof) data.append("idProof", formData.step1.idProof);
      if (formData.step1.regCert) data.append("regCert", formData.step1.regCert);

      // Step 2 fields
      data.append("flats", formData.step2.flats);
      data.append("blueBins", formData.step2.blueBins);
      data.append("avgWaste", formData.step2.avgWaste);

      // Multiple files
      if (formData.step2.receipts.length > 0)
        formData.step2.receipts.forEach((file) => data.append("receipts", file));

      if (formData.step2.photos.length > 0)
        formData.step2.photos.forEach((file) => data.append("photos", file));

      if (formData.step2.declaration) data.append("declaration", formData.step2.declaration);

      const response = await axios.post(
        "http://localhost:5000/api/society",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        alert("✅ " + response.data.message);
        setStep(1);
        setFormData({
          step1: {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
            idProof: null,
            regCert: null,
          },
          step2: {
            flats: "",
            blueBins: "",
            avgWaste: "",
            receipts: [],
            photos: [],
            declaration: null,
          },
        });
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert("❌ " + error.response.data.message);
      } else {
        alert("❌ Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="container">
      {/* Left side */}
      <div className="outerbox">
        <h1 className="heading">ECOBIN Society Portal</h1>
        <p className="subheading">
          Join us in making waste management smarter & greener.
        </p>
      </div>

      {/* Right side */}
      <div className="form-container">
        <div className="glass-card">
          {/* Progress bar */}
          <div className="progress-bar">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`progress-step ${step >= num ? "active" : ""}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="step-title">
                  <FaBuilding /> Society Identification
                </h2>
                <div className="form-grid">
                  <input
                    className="input-style"
                    placeholder="Society Name"
                    value={formData.step1.name}
                    onChange={(e) => handleChange(e, "step1", "name")}
                  />
                  <input
                    className="input-style"
                    placeholder="Official Email"
                    type="email"
                    value={formData.step1.email}
                    onChange={(e) => handleChange(e, "step1", "email")}
                  />
                  <input
                    className="input-style"
                    placeholder="Official Mobile Number"
                    type="tel"
                    value={formData.step1.phone}
                    onChange={(e) => handleChange(e, "step1", "phone")}
                  />
                  <input
                    className="input-style"
                    placeholder="Password"
                    type="password"
                    value={formData.step1.password}
                    onChange={(e) => handleChange(e, "step1", "password")}
                  />
                  <select
                    className="input-style"
                    value={formData.step1.role}
                    onChange={(e) => handleChange(e, "step1", "role")}
                  >
                    <option value="">Role of Person Logging In</option>
                    <option>Chairman</option>
                    <option>Secretary</option>
                    <option>Waste Management Head</option>
                  </select>
                  <div className="file-upload">
                    <label>
                      <FaIdCard /> Government ID Proof
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "step1", "idProof")}
                    />
                  </div>
                  <div className="file-upload">
                    <label>
                      <FaFileUpload /> Society Registration Certificate
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "step1", "regCert")}
                    />
                  </div>
                </div>
                <div className="form-nav">
                  <button onClick={nextStep} className="btn-primary">
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="step-title">
                  <FaTrash /> Proof of Blue Waste Generation
                </h2>
                <div className="form-grid">
                  <input
                    className="input-style"
                    placeholder="Number of Flats / Units"
                    type="number"
                    value={formData.step2.flats}
                    onChange={(e) => handleChange(e, "step2", "flats")}
                  />
                  <input
                    className="input-style"
                    placeholder="Number of Blue Bins Installed"
                    type="number"
                    value={formData.step2.blueBins}
                    onChange={(e) => handleChange(e, "step2", "blueBins")}
                  />
                  <input
                    className="input-style"
                    placeholder="Avg Blue Waste / Week (kg)"
                    type="number"
                    value={formData.step2.avgWaste}
                    onChange={(e) => handleChange(e, "step2", "avgWaste")}
                  />
                  <div className="file-upload">
                    <label>
                      <FaClipboardCheck /> Waste Collection Receipts
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, "step2", "receipts")}
                    />
                  </div>
                  <div className="file-upload">
                    <label>
                      <FaBinoculars /> Photos of Segregation Area
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, "step2", "photos")}
                    />
                  </div>
                  <div className="file-upload">
                    <label>
                      <FaFileUpload /> Signed Declaration Form
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "step2", "declaration")}
                    />
                  </div>
                </div>
                <div className="form-nav">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button onClick={nextStep} className="btn-primary">
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="step-title">
                  <FaUserShield /> Review & Submit
                </h2>
                <p className="review-text">
                  Review your details carefully. Once submitted, our team will
                  verify your documents.
                </p>
                <div className="form-nav">
                  <button onClick={prevStep} className="btn-secondary">
                    Back
                  </button>
                  <button onClick={handleSubmit} className="btn-primary">
                    Submit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
