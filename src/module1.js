import React from "react";
import "./module1.css";

function Module1() {
  return (
    <section className="module module-services">
      <div className="container">
        <div className="module-content">
          {/* Left Side: Title and Subtitle */}
          <div className="module-text">
            <h2 className="module-title">Our Services</h2>
            <p className="module-subtitle">
              ECOBIN provides eco-friendly waste management solutions for societies,
              commercial spaces, and events. From collection to recycling, we ensure
              sustainability and transparency.
            </p>
          </div>

          {/* Right Side: 2x2 Cards */}
          <div className="module-cards">
            <div className="card">
              <div className="card-icon">🏠</div>
              <h3>Residential Collection</h3>
            </div>
            <div className="card">
              <div className="card-icon">🏢</div>
              <h3>Commercial Waste</h3>
            </div>
            <div className="card">
              <div className="card-icon">♻️</div>
              <h3>Recycling Solutions</h3>
            </div>
            <div className="card">
              <div className="card-icon">💡</div>
              <h3>Consultation & Support</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Module1;
