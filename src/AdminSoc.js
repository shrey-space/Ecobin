import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminSoc() {
  const [societies, setSocieties] = useState([]);
  const [selectedSocieties, setSelectedSocieties] = useState([]); // Multi-selection
  const [approved, setApproved] = useState({}); // Track approval per society

  // 30-Day Session (single society view)
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [sessionStartDate, setSessionStartDate] = useState("");
  const [dailyWasteEntries, setDailyWasteEntries] = useState(Array(30).fill(""));
  const [ecoPointsRate] = useState(2);
  const [sessionTarget, setSessionTarget] = useState(0);

  // Waste Collection
  const [collectionDate, setCollectionDate] = useState("");
  const [collectionWeight, setCollectionWeight] = useState("");

  // Missions (outside society details, for multiple assignment)
  const [missions, setMissions] = useState([
    { name: "", place: "", date: "", time: "", ecoPoints: 0, maxParticipants: 0, description: "" },
  ]);


  // 🏆 Rewards Management
const [rewards, setRewards] = useState([{ name: "", image: null, imagePreview: "" }]);
const [rewardEndDate, setRewardEndDate] = useState("");
const [endDate, setEndDate] = useState("");


  // Fetch societies
  const fetchSocieties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/societies");
      if (res.data.success) {
        setSocieties(res.data.societies);
        const approvedObj = {};
        res.data.societies.forEach(soc => {
          approvedObj[soc._id] = soc.approved;
        });
        setApproved(approvedObj);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  // Toggle society selection (multi-select)
  const handleSelectSocietyCheckbox = (id) => {
    if (selectedSocieties.includes(id)) {
      setSelectedSocieties(selectedSocieties.filter(sid => sid !== id));
    } else {
      setSelectedSocieties([...selectedSocieties, id]);
    }
  };

  // Select a society to view details (single)
  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/society/${id}`);
      if (res.data.success) {
        const soc = res.data.society;
        setSelectedSociety(soc);
        setApproved(prev => ({ ...prev, [soc._id]: soc.approved }));
        setSessionTarget(soc.target || 0);
        setSessionStartDate(soc.sessionStartDate ? soc.sessionStartDate.split("T")[0] : "");
        setDailyWasteEntries(Array(30).fill(""));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve a society
  const handleApprove = async (societyId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/admin/society/${societyId}/approve`);
      if (res.data.success) {
        alert("✅ Society approved successfully!");
        fetchSocieties();
        setApproved(prev => ({ ...prev, [societyId]: true }));
        if (selectedSociety && selectedSociety._id === societyId) {
          setSelectedSociety({ ...selectedSociety, approved: true });
        }
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to approve society");
    }
  };

  // Start 30-Day Session
  const handleStartSession = async () => {
    const targetNum = Number(sessionTarget);
    if (!selectedSociety || !sessionStartDate || isNaN(targetNum)) {
      alert("Please set session start date and target.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/society/${selectedSociety._id}/start-session`,
        { startDate: sessionStartDate, target: targetNum }
      );
      if (res.data.success) {
        alert("✅ 30-Day session started!");
        setSelectedSociety(res.data.society);
        setDailyWasteEntries(Array(30).fill(""));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to start session");
    }
  };

  // Submit daily waste entries
  const handleSubmitDailyWaste = async () => {
    if (!selectedSociety) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/society/${selectedSociety._id}/daily-waste-session`,
        { dailyWasteEntries: dailyWasteEntries.map(Number), ecoPointsRate }
      );
      if (res.data.success) {
        alert("✅ 30-Day waste data submitted!");
        setSelectedSociety(res.data.updatedSociety);
        setDailyWasteEntries(Array(30).fill(""));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit daily waste session");
    }
  };

  // Submit waste collection
  const handleSubmitCollection = async () => {
    if (!selectedSociety || !collectionDate || !collectionWeight) {
      alert("Please enter collection date and weight.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/society/${selectedSociety._id}/collect-waste`,
        { date: collectionDate, weight: Number(collectionWeight) }
      );
      if (res.data.success) {
        alert("✅ Collection submitted successfully!");
        setSelectedSociety(res.data.updatedSociety);
        setCollectionDate("");
        setCollectionWeight("");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit collection");
    }
  };

  // Mission Management (add/remove/update)
  const addMissionSlot = () => {
    if (missions.length >= 5) return;
    setMissions([...missions, { name: "", place: "", date: "", time: "", ecoPoints: 0, maxParticipants: 0, description: "" }]);
  };
  const removeMissionSlot = (index) => {
    setMissions(missions.filter((_, i) => i !== index));
  };
  const handleMissionChange = (index, field, value) => {
    const newMissions = [...missions];
    newMissions[index][field] = value;
    setMissions(newMissions);
  };

  // Assign missions to multiple societies
  const handleAddMissionToSocieties = async () => {
    if (selectedSocieties.length === 0) return alert("Select at least one society");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/societies/add-mission-multiple`,
        { societyIds: selectedSocieties, missions }
      );
      if (res.data.success) {
        alert("✅ Missions assigned to selected societies!");
        setMissions([{ name: "", place: "", date: "", time: "", ecoPoints: 0, maxParticipants: 0, description: "" }]);
        setSelectedSocieties([]);
        fetchSocieties();
        if (selectedSociety) handleSelect(selectedSociety._id);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign missions");
    }
  };

  // Remove mission from single society
  const handleRemoveMissionFromSociety = async (missionIndex) => {
    if (!selectedSociety) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/society/${selectedSociety._id}/remove-mission`,
        { missionIndex }
      );
      if (res.data.success) {
        alert("✅ Mission removed!");
        setSelectedSociety(res.data.updatedSociety);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove mission");
    }
  };

  // Mark mission as completed
  const handleCompleteMission = async (missionIndex) => {
    if (!selectedSociety) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/society/${selectedSociety._id}/complete-mission`,
        { missionIndex }
      );
      if (res.data.success) {
        alert("✅ Mission marked as completed!");
        setSelectedSociety(res.data.updatedSociety);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to complete mission");
    }
  };
  // Add or Remove Reward Slots (Max 5)
const addRewardSlot = () => {
  if (rewards.length >= 5) return alert("Max 5 rewards allowed");
  setRewards([...rewards, { name: "", image: null, imagePreview: "" }]);
};

const removeRewardSlot = (index) => {
  setRewards(rewards.filter((_, i) => i !== index));
};

// Input Change Handlers
const handleRewardChange = (index, field, value) => {
  const updated = [...rewards];
  updated[index][field] = value;
  setRewards(updated);
};

const handleRewardImageUpload = (index, file) => {
  const updated = [...rewards];
  updated[index].image = file;
  updated[index].imagePreview = URL.createObjectURL(file);
  setRewards(updated);
};

// Upload Rewards to Backend
const handleUploadRewards = async () => {
  if (!rewardEndDate) return alert("⚠️ Please select an end date");

  try {
    const formData = new FormData();
    formData.append("societyId", selectedSociety._id);
    formData.append("endDate", endDate);


    rewards.forEach((r, i) => {
      formData.append(`rewards[${i}][name]`, r.name);
      if (r.image) formData.append(`rewards[${i}][image]`, r.image);
    });

    const res = await axios.post("http://localhost:5000/api/admin/rewards", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      alert("✅ Rewards uploaded successfully!");
      setRewards([{ name: "", image: null, imagePreview: "" }]);
      setRewardEndDate("");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error uploading rewards");
  }
};

  return (
    <div style={{ display: "flex", gap: "50px", padding: "20px" }}>
      {/* Society List with checkboxes for multi-select */}
      <div style={{ flex: 1 }}>
        <h2>Societies</h2>
        <ul>
          {societies.map((soc) => (
            <li key={soc._id} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSocieties.includes(soc._id)}
                  onChange={() => handleSelectSocietyCheckbox(soc._id)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => handleSelect(soc._id)}>
                  {soc.societyName} ({soc.email}) {soc.approved ? "✅" : "⏳"}
                </span>
              </label>
              {!soc.approved && (
                <button onClick={() => handleApprove(soc._id)} style={{ marginLeft: "10px" }}>Approve</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Society Details */}
      <div style={{ flex: 2 }}>
        {selectedSociety ? (
          <div>
            <h2>{selectedSociety.societyName}</h2>

            <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px", maxHeight: "200px", overflowY: "auto" }}>
              {JSON.stringify(selectedSociety, null, 2)}
            </pre>

            {/* 30-Day Waste Session */}
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
              <h3>30-Day Waste Session</h3>
              <label>Session Start Date:
                <input type="date" value={sessionStartDate} onChange={(e) => setSessionStartDate(e.target.value)} style={{ marginLeft: "10px" }} />
              </label>
              <label style={{ marginLeft: "20px" }}>Session Target:
                <input type="number" value={sessionTarget} onChange={(e) => setSessionTarget(e.target.value)} style={{ marginLeft: "10px" }} />
              </label>
              <button onClick={handleStartSession} style={{ marginLeft: "15px", padding: "6px 12px", background: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Start Session
              </button>

              <div style={{ marginTop: "20px" }}>
                <h4>Enter Daily Waste (kg)</h4>
                {dailyWasteEntries.map((entry, index) => (
                  <div key={index}>
                    <label>Day {index + 1}:
                      <input type="number" value={entry} onChange={(e) => {
                        const newEntries = [...dailyWasteEntries];
                        newEntries[index] = e.target.value;
                        setDailyWasteEntries(newEntries);
                      }} style={{ marginLeft: "10px", marginBottom: "5px" }} />
                    </label>
                  </div>
                ))}
                <button onClick={handleSubmitDailyWaste} style={{ marginTop: "10px", padding: "6px 12px", background: "green", color: "white", border: "none", cursor: "pointer" }}>Submit 30-Day Waste</button>
              </div>
            </div>
           {/* Uploaded Files */}
{/* Uploaded Files */}
<div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
  <h3>Uploaded Files</h3>
  {selectedSociety ? (
    <div>
      {selectedSociety.idProof && (
        <p>
          ID Proof:{" "}
          <a
            href={`http://localhost:5000/api/download/${selectedSociety.idProof}`}
            download={selectedSociety.idProof}
          >
            Download
          </a>
        </p>
      )}
      {selectedSociety.regCert && (
        <p>
          Registration Certificate:{" "}
          <a
            href={`http://localhost:5000/api/download/${selectedSociety.regCert}`}
            download={selectedSociety.regCert}
          >
            Download
          </a>
        </p>
      )}
      {selectedSociety.receipts?.length > 0 && (
        <div>
          Receipts:
          <ul>
            {selectedSociety.receipts.map((file, idx) => (
              <li key={idx}>
                <a
                  href={`http://localhost:5000/api/download/${file}`}
                  download={file}
                >
                  Download {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSociety.photos?.length > 0 && (
        <div>
          Photos:
          <ul>
            {selectedSociety.photos.map((file, idx) => (
              <li key={idx}>
                <a
                  href={`http://localhost:5000/api/download/${file}`}
                  download={file}
                >
                  Download {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSociety.declaration && (
        <p>
          Declaration:{" "}
          <a
            href={`http://localhost:5000/api/download/${selectedSociety.declaration}`}
            download={selectedSociety.declaration}
          >
            Download
          </a>
        </p>
      )}
    </div>
  ) : (
    <p>Select a society to see uploaded files</p>
  )}
</div>


            {/* Waste Collection */}
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
              <h3>Waste Collection</h3>
              <label>Collection Date:
                <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} style={{ marginLeft: "10px" }} />
              </label>
              <label style={{ marginLeft: "20px" }}>Weight (kg):
                <input type="number" value={collectionWeight} onChange={(e) => setCollectionWeight(e.target.value)} style={{ marginLeft: "10px" }} />
              </label>
              <button onClick={handleSubmitCollection} style={{ marginLeft: "15px", padding: "6px 12px", background: "purple", color: "white", border: "none", cursor: "pointer" }}>Submit Collection</button>
            </div>

            {/* Assigned Missions */}
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
              <h3>Assigned Missions</h3>
              {selectedSociety.missions && selectedSociety.missions.length > 0 ? (
                selectedSociety.missions.map((mission, index) => (
                  <div key={index} style={{ marginBottom: "10px", padding: "5px", border: "1px dashed gray" }}>
                    <strong>{mission.name}</strong> - {mission.place} - {mission.date} {mission.time} - {mission.ecoPoints} EcoPoints
                    <button onClick={() => handleRemoveMissionFromSociety(index)} style={{ marginLeft: "10px" }}>Remove</button>
                    <button onClick={() => handleCompleteMission(index)} style={{ marginLeft: "10px", background: "orange", color: "white", border: "none", cursor: "pointer" }}>Completed</button>
                  </div>
                ))
              ) : <p>No missions assigned yet</p>}
            </div>

            {/* Completed Missions */}
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
              <h3>Completed Missions</h3>
              {selectedSociety.completedMissions && selectedSociety.completedMissions.length > 0 ? (
                selectedSociety.completedMissions.map((mission, index) => (
                  <div key={index} style={{ marginBottom: "10px", padding: "5px", border: "1px dashed green" }}>
                    <strong>{mission.name}</strong> - {mission.place} - Earned {mission.ecoPoints} EcoPoints - Completed on {new Date(mission.completedAt).toLocaleDateString()}
                  </div>
                ))
              ) : <p>No missions completed yet</p>}
              <p>Total EcoPoints: {selectedSociety.actualEcoPoints || 0}</p>
            </div>
          </div>
        ) : <p>Select a society to see details</p>}

        {/* Missions Management (Outside Society Details) */}
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
          <h3>Add Missions (max 5) to Selected Societies</h3>
          {missions.map((mission, index) => (
            <div key={index} style={{ marginBottom: "15px", padding: "10px", border: "1px dashed gray" }}>
              <label>Name: <input type="text" value={mission.name} onChange={(e) => handleMissionChange(index, "name", e.target.value)} /></label><br />
              <label>Place: <input type="text" value={mission.place} onChange={(e) => handleMissionChange(index, "place", e.target.value)} /></label><br />
              <label>Date: <input type="date" value={mission.date} onChange={(e) => handleMissionChange(index, "date", e.target.value)} /></label><br />
              <label>Time: <input type="time" value={mission.time} onChange={(e) => handleMissionChange(index, "time", e.target.value)} /></label><br />
              <label>EcoPoints: <input type="number" value={mission.ecoPoints} onChange={(e) => handleMissionChange(index, "ecoPoints", e.target.value)} /></label><br />
              <label>Max Participants: <input type="number" value={mission.maxParticipants} onChange={(e) => handleMissionChange(index, "maxParticipants", e.target.value)} /></label><br />
              <label>Description: <input type="text" value={mission.description} onChange={(e) => handleMissionChange(index, "description", e.target.value)} /></label><br />
              <button onClick={() => removeMissionSlot(index)} style={{ marginTop: "5px" }}>Remove</button>
            </div>
          ))}
          <button onClick={addMissionSlot} style={{ marginRight: "10px" }}>Add Mission Slot</button>
          <button onClick={handleAddMissionToSocieties} style={{ background: "green", color: "white", padding: "6px 12px" }}>Assign Missions to Selected Societies</button>
         {/* 🏆 Rewards Management Section */}
<div style={{ marginTop: "30px", padding: "15px", border: "1px solid #aaa", borderRadius: "8px" }}>
  <h3>🏆 Reward Management (Max 5)</h3>

  {rewards.map((reward, index) => (
    <div key={index} style={{ border: "1px dashed gray", padding: "10px", marginBottom: "10px" }}>
      <label>Reward Name:
        <input
          type="text"
          value={reward.name}
          onChange={(e) => handleRewardChange(index, "name", e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />

      <label>Reward Image:
        <input
          type="file"
          onChange={(e) => handleRewardImageUpload(index, e.target.files[0])}
          style={{ marginLeft: "10px" }}
        />
      </label>

      {reward.imagePreview && (
        <img
          src={reward.imagePreview}
          alt="Preview"
          style={{ width: "100px", height: "100px", marginTop: "10px", borderRadius: "5px" }}
        />
      )}
      <br />
      <button onClick={() => removeRewardSlot(index)} style={{ marginTop: "5px", background: "#f44336", color: "white" }}>
        Remove Reward
      </button>
    </div>
  ))}

  <label>Rewards End Date:
    <input
      type="date"
      value={rewardEndDate}
      onChange={(e) => setRewardEndDate(e.target.value)}
      style={{ marginLeft: "10px" }}
    />
  </label>

  <div style={{ marginTop: "10px" }}>
    <button onClick={addRewardSlot} style={{ marginRight: "10px" }}>Add Reward Slot</button>
    <button
      onClick={handleUploadRewards}
      style={{ background: "#4CAF50", color: "white", padding: "6px 12px" }}
    >
      Upload Rewards
    </button>
  </div>
</div>

        </div>
        
      </div>
    </div>
  );
}

export default AdminSoc;
