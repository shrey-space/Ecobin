import React from 'react';
import { FaHome, FaIndustry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Society functions
  const goToSocSignUp = () => navigate("/soc_login");
  const goToSocLogin = () => navigate("/loginpage");
  const goToFamilyLogin = () => navigate("/FamilyLogin");

  // Recycler functions
  const goToRecyclerSign = () => navigate("/Recyclesign"); 
  const goToRecyclerLogin = () => navigate("/RecLogin"); // 🔹 redirect to Recycler login

  return (
    <div className="slogan-box1">
      <div className="card-container">
        
        {/* Society Card */}
        <div className="card">
          <FaHome className="icon1" />
          <div className="label">FOR SOCIETIES</div>
          <div className="title">ECOBINConnect</div>
          <button className="signin-btn" onClick={goToSocSignUp}>Sign in</button>
          <button className="login-btn" onClick={goToSocLogin}>Login</button>
          <button className="login-btn1" onClick={goToFamilyLogin}>Family Login</button>
        </div>

        {/* Recycler Card */}
        <div className="card">
          <FaIndustry className="icon1" />
          <div className="label">FOR RECYCLERS</div>
          <div className="title">ECOBINPro</div>
          <button className="signin-btn" onClick={goToRecyclerSign}>Sign in</button>
          <button className="login-btn" onClick={goToRecyclerLogin}>Login</button> {/* 🔹 Added */}
        </div>

      </div>
    </div>
  );
};

export default Login;
