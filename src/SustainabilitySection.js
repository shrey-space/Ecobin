import React from "react";
import sustainabilityImage from "./assets/images/sustain.jpg";
import "./SustainabilitySection.css";

function SustainabilitySection() {
  return (
    <section className="sustainability-section">
      <div className="sustainability-content">
        {/* Left Image */}
        <div className="sustainability-image">
          <img src={sustainabilityImage} alt="Sustainability Goals" />
        </div>

        {/* Right Text */}
        <div className="sustainability-text">
          <p className="subtitle">Expert Guidance</p>
          <h2>Meet your sustainability goals</h2>
          <p className="description">
            Rubicon’s Technical Advisory Services team partners with you to
            unlock circular economy solutions. From site audits and material
            recovery plans to zero waste program design and education. Turn
            complexity into clarity so you can meet your sustainability goals
            faster.
          </p>
          <button className="cta-button">Explore advisory services</button>
        </div>
      </div>
    </section>
  );
}

export default SustainabilitySection;
