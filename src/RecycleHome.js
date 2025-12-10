// RecycleHome.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./RecycleHome.css";

const RecycleHome = () => {
  const location = useLocation();
  const { recycler } = location.state || {};

  const [wasteStock, setWasteStock] = useState([]);   // from db.wastes
  const [quantities, setQuantities] = useState({});   // recycler request inputs
  const [requests, setRequests] = useState([]);       // recycler requests
  const [notifications, setNotifications] = useState([]); // approvals

  // ✅ Fetch all available waste from db.wastes
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/waste") // make sure port matches your server
      .then((res) => setWasteStock(res.data))
      .catch((err) => console.error("Error fetching waste:", err));
  }, []);

  // ✅ Fetch recycler's requests
  useEffect(() => {
    if (recycler?._id) {
      axios
        .get(`http://localhost:5001/api/requests?recyclerId=${recycler._id}`)
        .then((res) => {
          setRequests(res.data);
          setNotifications(res.data.filter((r) => r.approved === true));
        })
        .catch((err) => console.error("Error fetching requests:", err));
    }
  }, [recycler]);

  // ✅ Handle request input
  const handleQuantityChange = (wasteType, value) => {
    setQuantities((prev) => ({ ...prev, [wasteType]: value }));
  };

  // ✅ Submit waste request
  const handleRequest = async (wasteType) => {
    const qty = parseInt(quantities[wasteType], 10);
    if (!qty || qty <= 0) {
      alert("Enter a valid quantity!");
      return;
    }

    try {
      const payload = {
        recyclerId: recycler._id,
        recyclerName: recycler.companyName,
        requestedWastes: [{ type: wasteType, quantity: qty }],
      };

      await axios.post("http://localhost:5001/api/requests", payload);
      alert("Request submitted successfully!");

      // refresh recycler's requests
      const res = await axios.get(
        `http://localhost:5001/api/requests?recyclerId=${recycler._id}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request.");
    }
  };

  if (!recycler) {
    return <h2>No data found. Please login again.</h2>;
  }

  return (
    <div className="recyclehome-container">
      <h1>Welcome, {recycler.companyName} ♻️</h1>

      {/* Recycler Details */}
      <div className="details-box">
        <p><strong>Email:</strong> {recycler.email}</p>
        <p><strong>Phone:</strong> {recycler.phone}</p>
        <p><strong>GST Number:</strong> {recycler.gstNumber}</p>
        <p><strong>License Number:</strong> {recycler.licenseNumber}</p>
        <p><strong>Address:</strong> {recycler.address}</p>
        <p><strong>Preferred Waste Types:</strong> {recycler.wasteTypes.join(", ")}</p>
        <p><strong>Status:</strong> ✅ Approved</p>
      </div>

      {/* Available Waste from db.wastes */}
      <div className="waste-stock">
        <h2>Available Waste Stock</h2>
        {wasteStock.length === 0 ? (
          <p>No waste available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Waste Type</th>
                <th>Available Quantity (kg)</th>
                <th>Request</th>
              </tr>
            </thead>
            <tbody>
              {wasteStock.map((w) => (
                <tr key={w._id}>
                  <td>{w.wasteType}</td>
                  <td>{w.quantity}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={quantities[w.wasteType] || ""}
                      onChange={(e) =>
                        handleQuantityChange(w.wasteType, e.target.value)
                      }
                    />
                    <button onClick={() => handleRequest(w.wasteType)}>
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Requests Section */}
      <div className="requests-section">
        <h2>Your Requests</h2>
        {requests.length === 0 ? (
          <p>No requests made yet.</p>
        ) : (
          <ul>
            {requests.map((r) => (
              <li key={r._id}>
                <strong>
                  {r.requestedWastes
                    .map((w) => `${w.type} (${w.quantity}kg)`)
                    .join(", ")}
                </strong>
                <br />
                Requested on: {new Date(r.requestTime).toLocaleString()}
                <br />
                Status: {r.approved ? "✅ Approved" : "⏳ Pending"}
                {r.approved && (
                  <span>
                    {" "}
                    | Delivery Date:{" "}
                    {new Date(r.deliveryDate).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Notifications */}
      <div className="notifications">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No approvals yet.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n._id}>
                ✅ Your request for{" "}
                {n.requestedWastes
                  .map((w) => `${w.type} (${w.quantity}kg)`)
                  .join(", ")}{" "}
                has been approved. Delivery Date:{" "}
                {new Date(n.deliveryDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecycleHome;
