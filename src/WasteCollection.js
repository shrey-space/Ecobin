import React from "react";
import "./WasteCollection.css";

function WasteCollection() {
  return (
    <div className="waste-collection-container">
      {/* Left Section - Image */}
      <div className="waste-image-section">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
          alt="Waste Collection"
          className="waste-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="waste-content-section">
        <h1 className="waste-heading">Waste Collection Services</h1>
        <p className="waste-intro">
          Ecobin provides organized, transparent, and sustainable waste collection services for
          registered societies, families, and recycling companies. Our goal is to make
          eco-friendly waste management effortless while rewarding communities for participation.
        </p>

        <div className="waste-steps">
          <h2>Our Process</h2>
          <ul>
            <li>
              <strong>1. Society Request:</strong> Societies raise collection requests once blue waste bins reach capacity.
            </li>
            <li>
              <strong>2. Scheduled Pickup:</strong> Our verified staff collects and transports the waste safely to our storage units.
            </li>
            <li>
              <strong>3. Waste Segregation:</strong> Collected waste is categorized, weighed, and logged digitally for transparency.
            </li>
            <li>
              <strong>4. Recycling & Returns:</strong> The waste is sold to approved recyclers, and societies receive eco-points or monetary rewards.
            </li>
          </ul>
        </div>

        <div className="waste-benefits">
          <h2>Why Choose Ecobin?</h2>
          <ul>
            <li>✅ Digitally tracked waste collection system.</li>
            <li>✅ Transparent transactions and eco-point rewards.</li>
            <li>✅ Verified recyclers for responsible waste processing.</li>
            <li>✅ Community-driven sustainability initiatives.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WasteCollection;
