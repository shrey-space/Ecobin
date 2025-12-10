import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SocietyHome.css";

function SocietyHome() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const navigate = useNavigate();

  // EcoPoints state
  const [temporaryEcoPoints, setTemporaryEcoPoints] = useState(0);
  const [actualEcoPoints, setActualEcoPoints] = useState(0);
  const [targetPoints, setTargetPoints] = useState(500);

  // Weekly waste state
  const [weeklyWaste, setWeeklyWaste] = useState([
    { week: "Week 1", waste: 0, avgWaste: 0 },
    { week: "Week 2", waste: 0, avgWaste: 0 },
    { week: "Week 3", waste: 0, avgWaste: 0 },
    { week: "Week 4", waste: 0, avgWaste: 0 },
  ]);

  // Daily waste (30 days trend)
  const [dailyWasteSession, setDailyWasteSession] = useState([]);

  // Families list state
  const [families, setFamilies] = useState([]);
  const [loadingFamilies, setLoadingFamilies] = useState(true);
  const [familiesError, setFamiliesError] = useState("");

  // Missions
  const [missions, setMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);

 // 🏆 Rewards & Voting
const [rewards, setRewards] = useState([]);
const [loadingRewards, setLoadingRewards] = useState(true);
const [rewardError, setRewardError] = useState("");
 useEffect(() => {
  const fetchRewards = async () => {
    try {
      const storedFamily = localStorage.getItem("family");
      if (!storedFamily) return;
      const family = JSON.parse(storedFamily);

      const res = await axios.get(`http://localhost:5000/api/society/${family.societyId}/rewards`);
      if (res.data.success) {
        setRewards(res.data.rewards);
      } else {
        setRewardError("No active rewards found.");
      }
    } catch (err) {
      console.error(err);
      setRewardError("Failed to load rewards.");
    } finally {
      setLoadingRewards(false);
    }
  };

  fetchRewards();
}, []);
const handleVoteReward = async (rewardId) => {
  const storedFamily = localStorage.getItem("family");
  if (!storedFamily) return alert("Please log in as a family to vote!");

  const family = JSON.parse(storedFamily);
  try {
    const res = await axios.post(
      `http://localhost:5000/api/society/${family.societyId}/reward/${rewardId}/vote`,
      { familyId: family._id }
    );

    if (res.data.success) {
      alert("✅ Your vote has been recorded!");
      // update the rewards list
      const updated = rewards.map((r) =>
        r._id === rewardId ? res.data.updatedReward : r
      );
      setRewards(updated);
    }
  } catch (err) {
    alert("❌ You may have already voted for this reward!");
    console.error(err);
  }
};


  // Role (society or family)
  const role = localStorage.getItem("role");
 
  useEffect(() => {
    const storedSociety = localStorage.getItem("society");
    if (!storedSociety) return;

    const society = JSON.parse(storedSociety);
    const societyId = society._id;

    // Fetch session data
    const fetchSessionData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/society/${societyId}/session`
        );
        if (res.data.success) {
          const session = res.data.sessionData;

          setTemporaryEcoPoints(session.temporaryEcoPoints);
          setActualEcoPoints(session.actualEcoPoints);
          setTargetPoints(session.targetPoints);

          setWeeklyWaste([
            { week: "Week 1", waste: session.weeklyTotals.week1, avgWaste: 50 },
            { week: "Week 2", waste: session.weeklyTotals.week2, avgWaste: 50 },
            { week: "Week 3", waste: session.weeklyTotals.week3, avgWaste: 50 },
            { week: "Week 4", waste: session.weeklyTotals.week4, avgWaste: 50 },
          ]);

          setDailyWasteSession(session.dailyWasteSession || Array(30).fill(0));
        }
      } catch (err) {
        console.error("Failed to fetch session data:", err);
      }
    };

    // Fetch families
    const fetchFamilies = async () => {
      setLoadingFamilies(true);
      setFamiliesError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/society/${societyId}/families`
        );
        if (res.data.success) {
          setFamilies(res.data.families);
        } else {
          setFamiliesError("Failed to fetch families.");
        }
      } catch (err) {
        console.error("Failed to fetch families:", err);
        setFamiliesError("Server error while fetching families.");
      } finally {
        setLoadingFamilies(false);
      }
    };
   


    // Fetch missions
    const fetchMissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/society/${societyId}/missions`
        );
        if (res.data.success) {
          setMissions(res.data.missions || []);
          setCompletedMissions(res.data.completedMissions || []);
        }
      } catch (err) {
        console.error("Failed to fetch missions:", err);
      }
    };

   

    fetchSessionData();
    fetchFamilies();
    fetchMissions();
    
  }, []);
  
  const [societyData, setSocietyData] = useState(null);
  const [currentBadge, setCurrentBadge] = useState("");

useEffect(() => {
  const fetchSocietyData = async () => {
    try {
      const storedSociety = JSON.parse(localStorage.getItem("society"));
      if (storedSociety?._id) {
        const response = await axios.get(
          `http://localhost:5000/api/admin/society/${storedSociety._id}`
        );
        setSocietyData(response.data.society);
         if (response.data.society?.badges?.length > 0) {
  // take the last badge (latest one)
  setCurrentBadge(response.data.society.badges.slice(-1)[0]);
}
      }
     

    } catch (error) {
      console.error("Error fetching society data:", error);
    }
  };
  fetchSocietyData();
}, []);




 const [leaderboard, setLeaderboard] = useState([]);
const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
const [societyRank, setSocietyRank] = useState(null);

useEffect(() => {
  if (activeMenu === "Leaderboard") {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/societies/leaderboard");
        if (res.data.success) {
  setLeaderboard(res.data.leaderboard);

  const currentSociety = JSON.parse(localStorage.getItem("society"));
  if (currentSociety?.societyName) {
    const rankIndex = res.data.leaderboard.findIndex(
      (s) =>
        (s.name || s.societyName || "")
          .trim()
          .toLowerCase() === currentSociety.societyName.trim().toLowerCase()
    );

    
    if (rankIndex !== -1) {
      setSocietyRank(rankIndex + 1);
    }
  }
}

      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }
}, [activeMenu]);



  // Chart data
  const ecoPointsData = [
    { name: "Current", EcoPoints: actualEcoPoints },
    { name: "Target", EcoPoints: targetPoints },
  ];

  const dailyWasteData = dailyWasteSession.map((waste, index) => ({
    day: `Day ${index + 1}`,
    waste,
    cumulative: dailyWasteSession
      .slice(0, index + 1)
      .reduce((sum, val) => sum + val, 0),
    target: (index + 1) * 10,
  }));

  const averageDailyWaste =
    dailyWasteSession.length > 0
      ? (
          dailyWasteSession.reduce((sum, val) => sum + val, 0) /
          dailyWasteSession.length
        ).toFixed(2)
      : 0;

  return (
    <div className="society-container">
      {/* Sidebar */}
      <div className="sidebar">
       <h2 className="sidebar-title">
  Society: {societyData?.societyName || "Loading..."}
</h2>



        <ul className="menu">
          {[
            "Home",
            "Waste Tracking",
            "EcoPoints",
            "Leaderboard",
            "Missions",
            "Rewards & Benefits",
            "Families",
            "Impact",
            "Help & Support",
          ].map((item) => (
            <li
              key={item}
              className={activeMenu === item ? "menu-item active" : "menu-item"}
              onClick={() => setActiveMenu(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

     
{/* Main Content */}
<div className="main-content">
  <div className="header-card">
    <div className="header-info">
      <span>
        EcoPoints: <strong>{actualEcoPoints}</strong>
      </span>
      <span>
        Rank in State:{" "}
        <strong>
          {societyRank ? `#${societyRank}` : "Not Ranked Yet"}
        </strong>
      </span>
      <span>
        Current Badge:{" "}
        <strong style={{ color: "#4CAF50" }}>
          {currentBadge || "No Badge Yet"}
        </strong>
      </span>
    </div>
  </div>



        <div className="section-content">
          {/* Home */}
          {activeMenu === "Home" && (
  <div className="home-dashboard">
    <h2 className="dashboard-title">🏡 Society Dashboard Overview</h2>
    <p className="dashboard-subtitle">Quick summary of your society’s progress</p>

    {/* Summary Cards */}
    <div className="summary-cards">
      <div className="card">
        <h4>EcoPoints</h4>
        <p><strong>{actualEcoPoints}</strong> / {targetPoints}</p>
        <p className="small">Target Progress</p>
      </div>

      <div className="card">
        <h4>Average Waste</h4>
        <p><strong>{averageDailyWaste} kg</strong></p>
        <p className="small">Per Day</p>
      </div>

      <div className="card">
        <h4>Rank</h4>
        <p><strong>{societyRank ? `#${societyRank}` : "N/A"}</strong></p>
        <p className="small">In Leaderboard</p>
      </div>

      <div className="card">
        <h4>Current Badge</h4>
        <p><strong>{currentBadge || "No Badge"}</strong></p>
        <p className="small">Recognition Level</p>
      </div>
    </div>

    {/* Charts Row */}
    <div className="charts-row">
      {/* EcoPoints Progress */}
      <div className="chart-box">
        <h4>🌿 EcoPoints Progress</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ecoPointsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, targetPoints]} />
            <Tooltip />
            <Line type="monotone" dataKey="EcoPoints" stroke="#4CAF50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Waste */}
      <div className="chart-box">
        <h4>♻️ Weekly Waste</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyWaste}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="waste" fill="#8884d8" name="Waste (kg)" />
            <Bar dataKey="avgWaste" fill="#82ca9d" name="Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Missions Summary */}
    <div className="missions-summary">
      <h4>🚀 Missions Overview</h4>
      <p>
        <strong>Active Missions:</strong> {missions.length} |{" "}
        <strong>Completed:</strong> {completedMissions.length}
      </p>
      {missions.slice(0, 2).map((mission, i) => (
        <div key={i} className="mission-mini">
          <p><strong>{mission.name}</strong> — {mission.place}</p>
        </div>
      ))}
      {missions.length === 0 && <p>No missions assigned.</p>}
    </div>

    {/* Rewards Preview */}
    <div className="rewards-preview">
      <h4>🏆 Rewards & Voting</h4>
      {rewards.length > 0 ? (
        <div className="reward-preview-list">
          {rewards.slice(0, 2).map((reward, index) => (
            <div key={index} className="reward-preview-card">
              <p><strong>Reward Set #{index + 1}</strong></p>
              <p>Ends: {new Date(reward.expiryDate).toLocaleDateString()}</p>
              <div className="reward-products">
                {reward.products.slice(0, 2).map((prod, i) => (
                  <div key={i} className="reward-product-mini">
                    <img
                      src={`http://localhost:5000/uploads/${prod.image}`}
                      alt={prod.name}
                    />
                    <p>{prod.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No active rewards.</p>
      )}
    </div>
  </div>
)}


          {/* Waste Tracking */}
          {activeMenu === "Waste Tracking" && (
            <div className="home-section">
              <h3>Weekly Waste Collection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={weeklyWaste}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="waste" fill="#8884d8" />
                  <Bar dataKey="avgWaste" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              <h3>Monthly Waste Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dailyWasteData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="waste" stroke="#8884d8" />
                  <Line type="monotone" dataKey="cumulative" stroke="#ff7300" />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="stats">
                <p>
                  <strong>Average Daily Waste:</strong> {averageDailyWaste} kg
                </p>
              </div>
            </div>
          )}
          {activeMenu === "EcoPoints" && (
  <div className="home-section">
    <h3>🌿 EcoPoints Summary</h3>

    {/* EcoPoints conversion info */}
    <div
      style={{
        backgroundColor: "#f1f8e9",
        borderLeft: "5px solid #4CAF50",
        padding: "10px 15px",
        marginBottom: "20px",
        borderRadius: "8px",
        fontSize: "16px",
      }}
    >
      <strong>♻️ Conversion Rate:</strong> 1 kg of waste recycled ={" "}
      <strong>2 EcoPoints</strong>
    </div>

    {/* EcoPoints Progress Line Chart */}
    <div style={{ marginBottom: "40px" }}>
      <h4>Current vs Target EcoPoints</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={[
            { name: "Current", EcoPoints: actualEcoPoints },
            { name: "Target", EcoPoints: targetPoints },
          ]}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, targetPoints]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="EcoPoints"
            stroke="#4CAF50"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Waste vs EcoPoints Bar Chart */}
    <div>
      <h4>Waste Collected vs EcoPoints Earned</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={weeklyWaste.map((w) => ({
            week: w.week,
            waste: w.waste,
            ecoPoints: w.waste * 2, // conversion logic
          }))}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="waste" fill="#8884d8" name="Waste (kg)" />
          <Bar dataKey="ecoPoints" fill="#4CAF50" name="EcoPoints" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Summary Stats */}
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <p>
        🌱 <strong>Total EcoPoints Earned:</strong> {actualEcoPoints}
      </p>
      <p>
        ♻️ <strong>Estimated Total Waste Recycled:</strong>{" "}
        {(actualEcoPoints / 2).toFixed(1)} kg
      </p>
    </div>
  </div>
)}

          {/* Missions */}
          {activeMenu === "Missions" && (
            <div className="home-section">
              <h3>Assigned Missions</h3>
              {missions.length > 0 ? (
                missions.map((mission, index) => (
                  <div key={index} className="mission-card">
                    <h4>{mission.name}</h4>
                    <p>
                      <strong>Place:</strong> {mission.place}
                    </p>
                    <p>
                      <strong>Date:</strong> {mission.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {mission.time}
                    </p>
                    <p>
                      <strong>EcoPoints:</strong> {mission.ecoPoints}
                    </p>
                    <p>
                      <strong>Max Participants:</strong> {mission.maxParticipants}
                    </p>
                    <p>{mission.description}</p>
                  </div>
                ))
              ) : (
                <p>No missions assigned yet.</p>
              )}

              <h3 style={{ marginTop: "20px" }}>Completed Missions</h3>
              {completedMissions.length > 0 ? (
                completedMissions.map((mission, index) => (
                  <div key={index} className="mission-card completed">
                    <h4>{mission.name}</h4>
                    <p>
                      <strong>Place:</strong> {mission.place}
                    </p>
                    <p>
                      <strong>EcoPoints Earned:</strong> {mission.ecoPoints}
                    </p>
                    <p>
                      <strong>Completed On:</strong>{" "}
                      {new Date(mission.completedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No missions completed yet.</p>
              )}
            </div>
          )}
          {activeMenu === "Rewards & Benefits" && (
  
      <p>No active rewards available yet.</p>
    
  
)}

          {/* Leaderboard */}



{/* 🏆 Leaderboard Section */}
{/* 🏆 Leaderboard Section */}
{activeMenu === "Leaderboard" && (
  <div className="home-section">
    <h3>🏆 Leaderboard</h3>
    <p className="leaderboard-subtitle">
      Top societies ranked by total EcoPoints
    </p>

    {loadingLeaderboard ? (
      <p>Loading leaderboard...</p>
    ) : leaderboard.length > 0 ? (
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Society Name</th>
            <th>EcoPoints</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((society, index) => {
            const currentSocietyName = JSON.parse(localStorage.getItem("society"))?.societyName?.trim().toLowerCase();
            const leaderboardName = (society.name || society.societyName || "").trim();

            return (
              <tr
                key={index}
                className={leaderboardName.toLowerCase() === currentSocietyName ? "current-society-row" : ""}
              >
                <td>{index + 1}</td>
                <td>{leaderboardName}</td>
                <td>{society.ecoPoints || 0}</td>
                <td>{society.badge || "No Badge"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <p>No societies found.</p>
    )}
  </div>
)}

{activeMenu === "Impact" && (
  <div className="home-section impact-section">
    <h2>🌍 Our Environmental Impact</h2>
    <p className="impact-subtitle">
      Here's how <strong>{societyData?.societyName || "your society"}</strong> 
      is helping build a cleaner and greener world.
    </p>

    {/* Impact Highlights */}
    <div className="impact-stats-grid">
      <div className="impact-card">
        <h4>♻️ Total Waste Recycled</h4>
        <p className="impact-number">
          {(actualEcoPoints / 2).toFixed(1)} kg
        </p>
        <p className="impact-label">Converted to EcoPoints</p>
      </div>

      <div className="impact-card">
        <h4>🌿 CO₂ Emissions Saved</h4>
        <p className="impact-number">
          {((actualEcoPoints / 2) * 1.5).toFixed(1)} kg
        </p>
        <p className="impact-label">Estimated CO₂ Reduction</p>
      </div>

      <div className="impact-card">
        <h4>🌳 Trees Equivalent</h4>
        <p className="impact-number">
          {Math.floor((actualEcoPoints / 2) / 10)}
        </p>
        <p className="impact-label">Trees Saved</p>
      </div>

      <div className="impact-card">
        <h4>👨‍👩‍👧 Families Participating</h4>
        <p className="impact-number">{families.length}</p>
        <p className="impact-label">Active Families</p>
      </div>

      <div className="impact-card">
        <h4>🚀 Missions Completed</h4>
        <p className="impact-number">{completedMissions.length}</p>
        <p className="impact-label">Community Efforts</p>
      </div>
    </div>

    {/* Impact Growth Chart */}
    <div className="impact-chart-box">
      <h3>📈 EcoPoints Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyWasteData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#4CAF50"
            strokeWidth={3}
            name="Cumulative Waste (kg)"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#82ca9d"
            strokeDasharray="4 4"
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Narrative Insight */}
    <div className="impact-summary">
      <h4>🌏 Sustainability Summary</h4>
      <p>
        With <strong>{families.length}</strong> families actively participating,
        your society has recycled over{" "}
        <strong>{(actualEcoPoints / 2).toFixed(1)} kg</strong> of waste,
        reducing approximately{" "}
        <strong>{((actualEcoPoints / 2) * 1.5).toFixed(1)} kg</strong> of CO₂ emissions
        — that’s like planting{" "}
        <strong>{Math.floor((actualEcoPoints / 2) / 10)}</strong> trees! 🌱
      </p>
    </div>
  </div>
)}
 {activeMenu === "Help & Support" && (
  <div className="home-section help-support-section">
    <h2>🆘 Help & Support</h2>
    <p className="help-intro">
      Need assistance? We’re here to help you with any issues, suggestions, or questions
      related to your society’s eco management and portal usage.
    </p>

    {/* Contact Options */}
    <div className="help-contact-grid">
      <div className="help-card">
        <h4>📧 Email Support</h4>
        <p>
          Reach out to us at <strong>ecobin1104@gmail.com</strong> for any account,
          login, or technical issues.
        </p>
      </div>

      <div className="help-card">
        <h4>💬 Live Chat</h4>
        <p>
          Use our in-app chat (bottom-right corner) to connect instantly with our support
          representative between <strong>9 AM – 6 PM (Mon–Sat)</strong>.
        </p>
      </div>

      <div className="help-card">
        <h4>📞 Phone Assistance</h4>
        <p>
          Call our eco-support line at <strong>+91 98765 43210</strong> for urgent
          help or guidance.
        </p>
      </div>

      <div className="help-card">
        <h4>📘 User Guide</h4>
        <p>
          Learn how to use all features by visiting our online{" "}
          <a
            href="https://greenconnect-docs.com/guide"
            target="_blank"
            rel="noopener noreferrer"
          >
            Help Documentation
          </a>.
        </p>
      </div>
    </div>

    {/* FAQ Section */}
    <div className="help-faq">
      <h3>❓ Frequently Asked Questions</h3>

      <details>
        <summary>How do I earn EcoPoints?</summary>
        <p>
          You earn EcoPoints automatically when your family or society records waste
          collection, participates in missions, or completes recycling tasks.
        </p>
      </details>

      <details>
        <summary>Can I edit my society information?</summary>
        <p>
          Only society admins can edit society details. Go to the settings page under
          your profile to update society info.
        </p>
      </details>

      <details>
        <summary>Why can’t I vote for a reward?</summary>
        <p>
          You may have already voted for that reward set, or the voting period may have
          expired.
        </p>
      </details>

      <details>
        <summary>How is my rank calculated?</summary>
        <p>
          Ranks are based on total EcoPoints earned by your society in comparison to
          others across the state.
        </p>
      </details>
    </div>

    {/* Feedback Form */}
    <div className="help-feedback">
      <h3>💡 Share Feedback</h3>
      <p>
        Have ideas to improve our platform? Tell us what you think below — we’d love to
        hear from you!
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("✅ Thank you for your feedback!");
        }}
        className="feedback-form"
      >
        <textarea
          placeholder="Enter your feedback or suggestions..."
          required
        ></textarea>
        <button type="submit" className="btn-primary">
          Submit Feedback
        </button>
      </form>
    </div>
  </div>
)}







          

          {/* Families */}
          {activeMenu === "Families" && (
            <div className="home-section">
              <h3>Families in Your Society</h3>
              <p>Manage families linked to your society here.</p>

              {role === "society" && (
                <button
                  className="invite-btn"
                  onClick={() => navigate("/invite-family")}
                >
                  ➕ Invite Family
                </button>
              )}

              {loadingFamilies ? (
                <p>Loading families...</p>
              ) : familiesError ? (
                <p style={{ color: "red" }}>{familiesError}</p>
              ) : families.length > 0 ? (
                <ul className="family-list">
                  {families.map((fam) => (
                    <li key={fam._id}>
                      Room {fam.roomNo} - {fam.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No families invited yet.</p>
              )}
            </div>
          )}

          {/* Placeholder for other pages */}
          {activeMenu !== "Home" &&
            activeMenu !== "Waste Tracking" &&
            activeMenu !== "Families" &&
            activeMenu !== "Missions" &&
            activeMenu !== "Rewards & Benefits" && 
            activeMenu !== "Leaderboard" && (
              <div className="placeholder">
                <h3>{activeMenu} Page</h3>
                <p>Content for {activeMenu} will appear here.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default SocietyHome;
