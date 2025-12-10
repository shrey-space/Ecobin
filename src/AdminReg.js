import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminReg.css";

const wasteTypesList = ["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste"];

const AdminReg = () => {
  const [recyclers, setRecyclers] = useState([]);
  const [selectedRecycler, setSelectedRecycler] = useState(null);

  const [wasteStock, setWasteStock] = useState({});
  const [inputValues, setInputValues] = useState({});

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Fetch recyclers
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/recyclers")
      .then((res) => setRecyclers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch global waste stock
  const fetchWasteStock = () => {
    axios
      .get("http://localhost:5001/api/waste")
      .then((res) => {
        const stockObj = {};
        res.data.forEach((w) => {
          stockObj[w.wasteType] = w.quantity;
        });
        setWasteStock(stockObj);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchWasteStock();
    fetchRequests();
  }, []);

  // Fetch all waste requests
  const fetchRequests = () => {
    axios
      .get("http://localhost:5001/api/requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Error fetching requests:", err));
  };

  // Handle stock input
  const handleInputChange = (e, type) => {
    setInputValues({ ...inputValues, [type]: Number(e.target.value) });
  };

  // Add waste
  const handleAddWaste = () => {
    wasteTypesList.forEach((type) => {
      const qty = inputValues[type] || 0;
      if (qty > 0) {
        axios
          .post("http://localhost:5001/api/waste/add", { wasteType: type, quantity: qty })
          .then(() => fetchWasteStock())
          .catch((err) => console.error(err));
      }
    });
    alert("Waste added successfully!");
    setInputValues({});
  };

  // Remove waste
  const handleRemoveWaste = () => {
    wasteTypesList.forEach((type) => {
      const qty = inputValues[type] || 0;
      if (qty > 0 && wasteStock[type] > 0) {
        axios
          .post("http://localhost:5001/api/waste/remove", { wasteType: type, quantity: qty })
          .then(() => fetchWasteStock())
          .catch((err) => console.error(err));
      }
    });
    alert("Waste removed successfully!");
    setInputValues({});
  };

  // Approve request
  const handleApproveRequest = () => {
    if (!deliveryDate) {
      alert("Please select a delivery date!");
      return;
    }

    axios
      .put(`http://localhost:5001/api/requests/${selectedRequest._id}/approve`, {
        deliveryDate,
      })
      .then(() => {
        alert("Request approved successfully!");
        setSelectedRequest(null);
        setDeliveryDate("");
        fetchRequests();
      })
      .catch((err) => console.error("Error approving request:", err));
  };

  return (
    <div className="adminreg-container">
      <h2>♻️ Admin Panel</h2>

      <div className="adminreg-flex">
        {/* LEFT: Recycler Companies */}
        <div className="recycler-list">
          <h3>Recycling Companies</h3>
          {recyclers.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            <ul>
              {recyclers.map((rec) => (
                <li
                  key={rec._id}
                  className="recycler-item"
                  onClick={() => setSelectedRecycler(rec)}
                >
                  <strong>{rec.companyName}</strong> <br />
                  <span>{rec.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Recycler Details */}
        <div className="recycler-details">
          {selectedRecycler ? (
            <div>
              <h3>Company Details</h3>
              <p><b>Name:</b> {selectedRecycler.companyName}</p>
              <p><b>Email:</b> {selectedRecycler.email}</p>
              <p><b>Phone:</b> {selectedRecycler.phone}</p>
              <p><b>GST Number:</b> {selectedRecycler.gstNumber}</p>
              <p><b>License:</b> {selectedRecycler.licenseNumber}</p>
              <p><b>Address:</b> {selectedRecycler.address}</p>
              <p><b>Waste Types:</b> {selectedRecycler.wasteTypes.join(", ")}</p>
              <p><b>Status:</b> {selectedRecycler.approved ? "✅ Approved" : "❌ Pending"}</p>

              {!selectedRecycler.approved && (
                <button
                  className="approve-btn"
                  onClick={() => {
                    axios
                      .put(`http://localhost:5001/api/recyclers/${selectedRecycler._id}/approve`)
                      .then(() => {
                        alert("Recycler approved!");
                        setRecyclers(
                          recyclers.map((r) =>
                            r._id === selectedRecycler._id
                              ? { ...r, approved: true }
                              : r
                          )
                        );
                        setSelectedRecycler({ ...selectedRecycler, approved: true });
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  Approve Company
                </button>
              )}
            </div>
          ) : (
            <p>Select a company to view details.</p>
          )}
        </div>
      </div>

      {/* GLOBAL WASTE MANAGEMENT */}
      <div className="global-waste-management">
        <h3>🗑️ Manage Global Blue Waste</h3>
        {wasteTypesList.map((type) => (
          <div key={type} className="waste-row">
            <span>{type} (Available: {wasteStock[type] || 0} Kg)</span>
            <input
              type="number"
              placeholder="Qty"
              value={inputValues[type] || ""}
              onChange={(e) => handleInputChange(e, type)}
            />
          </div>
        ))}
        <div className="waste-buttons">
          <button onClick={handleAddWaste} className="add-btn">Add Waste</button>
          <button onClick={handleRemoveWaste} className="remove-btn">Remove Waste</button>
        </div>
      </div>

      {/* REQUESTS MANAGEMENT */}
      <div className="requests-management">
        <h3>📩 Waste Requests</h3>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li
                key={req._id}
                className="request-item"
                onClick={() => setSelectedRequest(req)}
              >
                <b>{req.recyclerName}</b> requested:{" "}
                {req.requestedWastes.map((w) => `${w.type} (${w.quantity}kg)`).join(", ")} <br />
                <small>{new Date(req.requestTime).toLocaleString()}</small> |{" "}
                {req.approved ? "✅ Approved" : "⏳ Pending"}
              </li>
            ))}
          </ul>
        )}

        {selectedRequest && (
          <div className="request-details">
            <h4>Request Details</h4>
            <p><b>Recycler:</b> {selectedRequest.recyclerName}</p>
            <p><b>Wastes:</b> {selectedRequest.requestedWastes.map((w) => `${w.type} (${w.quantity}kg)`).join(", ")}</p>
            <p><b>Requested On:</b> {new Date(selectedRequest.requestTime).toLocaleString()}</p>
            <p><b>Status:</b> {selectedRequest.approved ? "✅ Approved" : "⏳ Pending"}</p>

            {!selectedRequest.approved && (
              <div>
                <label>Select Delivery Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
                <button onClick={handleApproveRequest} className="approve-btn">
                  Approve Request
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReg;
