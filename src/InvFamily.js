import React, { useState } from "react";
import axios from "axios";
import "./InvFamily.css"; // optional styling

function InvFamily() {
  const [roomNo, setRoomNo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInvite = async () => {
    setMessage("");
    setError("");

    try {
      const society = JSON.parse(localStorage.getItem("society"));
      if (!society) {
        setError("⚠️ Society not found. Please login again.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/family/invite", {
        societyId: society._id, // ✅ attach society ID
        roomNo,
        email,
      });

      if (res.data.success) {
        setMessage("✅ Invite sent successfully!");
        setRoomNo("");
        setEmail("");
      } else {
        setError(res.data.message || "❌ Failed to send invite");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Server error while sending invite.");
    }
  };

  return (
    <div className="invite-family">
      <h2>Invite Family</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Room No."
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Family Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleInvite}>➕ Send Invite</button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default InvFamily;
