// Slides.js
import React, { useState } from "react";
import "./Slides.css"; // for styling

const slidesData = [
  {
    image: "Gemini_Generated_Image_1ageva1ageva1age-removebg-preview.png",
    text: "Society Registration & Verification – Officials sign up and verify their identity."
  },
  {
    image: "slide2.jpg",
    text: "Families Join Through Invite – Residents register using a unique code."
  },
  {
    image: "slide3.jpg",
    text: "Collect Waste & Earn Points – Families gather waste and earn rewards."
  },
  {
    image: "slide4.jpg",
    text: "Redeem Rewards – Points are used for eco-projects and upgrades."
  }
];

export default function Slides() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slidesData.length - 1 : prev - 1
    );
  };

  return (
    <div className="slider-container">
      
     
        <div className="box_1">
            <button className="arrow_left left" onClick={prevSlide}>←</button>

        <img src={slidesData[current].image} alt="slide" /></div>
         <div className="box_2"><h2 className="desc">{slidesData[current].text}</h2><button className="arrow_right right" onClick={nextSlide}>→</button></div>
      </div>

      
  
  );
}
