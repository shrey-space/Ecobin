import React from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: "20px"
    }}>
      <h1>Admin Panel</h1>
      
      <div style={{ display: "flex", gap: "50px" }}>
        <button
          style={{ padding: "20px 40px", fontSize: "18px", cursor: "pointer" }}
          onClick={() => navigate("/adminsoc")}
        >
          Societies
        </button>

        <button
          style={{ padding: "20px 40px", fontSize: "18px", cursor: "pointer" }}
          onClick={() => navigate("/adminreg")}
        >
          Recycling Companies
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
