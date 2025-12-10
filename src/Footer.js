import React from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import "./Footer.css";


function Footer() {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-logo">
          <svg  width="40px" height="40px" viewBox="0 -8 72 72" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><title>recycle</title><path d="M24.42,30.55,27,32.1c.42,0,.64-.18.64-.53a2.3,2.3,0,0,0-.3-.94l-5.6-10.51-12.39.3a.78.78,0,0,0-.84.87c0,.13.18.3.53.53l2.57,1.55L8.84,27.6a6.15,6.15,0,0,0-1.13,3A4.91,4.91,0,0,0,8.46,33l8.43,14.7a12.58,12.58,0,0,1-.3-2.64A8,8,0,0,1,18,40.64l6.43-10.09Z" /><path d="M27.67,22,34.62,11.2q-3.9-8.88-8.28-8.88c-1.76,0-2.94.49-3.55,1.47L16.21,14.3,27.67,22Z" /><path d="M22,51.15H35.41V37.2H22.49a47.41,47.41,0,0,0-3,4.61,8.66,8.66,0,0,0-1,3.93q0,5.41,3.48,5.41Z" /><path d="M49.63,19.4l6-10a2.22,2.22,0,0,0,.3-1.1c0-.45-.15-.68-.45-.68a2.53,2.53,0,0,1-.61.23L52.12,9,49.63,4.09Q48,.77,43,.77H27.44a12.15,12.15,0,0,1,3.85,1.7q2.39,1.89,4.88,7.1l3.1,6.5L37,17.17a.6.6,0,0,0-.34.61c0,.37.24.59.72.64l12.29,1Z" /><path d="M55.6,49.07l8.69-15.8a9.69,9.69,0,0,1-4.19,2.95,17.27,17.27,0,0,1-5.18.61H45.24v-2q0-1.17-.57-1.17a.65.65,0,0,0-.6.3L38,44.57l6.35,9.76c.48.73.89,1,1.24.86s.53-.28.53-.56V51.3h5.37a4.33,4.33,0,0,0,4.16-2.23Z" /><path d="M51.82,34.82H57.6A6.91,6.91,0,0,0,61.91,33q2.39-1.89,2.38-4a3.47,3.47,0,0,0-.64-1.93l-6.88-10.5L44.94,23.45l6.88,11.37Z" /></svg>
          <span>ECOBIN</span>
        </div>

        <div className="footer-social">
          <FaFacebookF />
          <FaXTwitter />
          <FaLinkedinIn />
          <FaInstagram />
          <FaYoutube />
        </div>

        <div className="footer-subscribe">
          <input type="email" placeholder="Your email" />
          <button>Submit</button>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom Links Section */}
      <div className="footer-links">
        <div className="footer-column">
          <h4>Need help?</h4>
          <a href="#">Get support</a>
          <a href="#">System status</a>
        </div>

        <div className="footer-column">
          <h4>Products</h4>
          <a href="#">Dumpster Rentals</a>
          <a href="#">Enterprise Businesses</a>
          <a href="#">Small or Independent Businesses</a>
          <a href="#">Haulers</a>
          <a href="#">Technical Advisory Services</a>
          <a href="#">RUBICONRegWatch™</a>
          <a href="#">Sustainability Reporting</a>
        </div>

        <div className="footer-column">
          <h4>Our Company</h4>
          <a href="#">About Rubicon</a>
          <a href="#">Culture</a>
          <a href="#">Corporate Citizenship Report</a>
          <a href="#">Leadership Team</a>
          <a href="#">Investors ↗</a>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          <a href="#">Careers</a>
          <a href="#">Events</a>
          <a href="#">News</a>
        </div>

        <div className="footer-column">
          <h4>Content</h4>
          <a href="#">Blog</a>
          <a href="#">Customer Stories</a>
          <a href="#">Trash or Treasure</a>
          <a href="#">Video Library</a>
        </div>

        <div className="footer-column">
          <h4>Industries</h4>
          <a href="#">Construction & Demolition</a>
          <a href="#">Distribution & Logistics</a>
          <a href="#">Grocery</a>
          <a href="#">Healthcare</a>
          <a href="#">Manufacturing</a>
          <a href="#">Property Management</a>
          <a href="#">Restaurant</a>
          <a href="#">Retail</a>
        </div>

        <div className="footer-column">
          <h4>Waste Streams</h4>
          <a href="#">Commercial Recycling</a>
          <a href="#">Construction & Demolition</a>
          <a href="#">E-Waste</a>
          <a href="#">Food Waste</a>
          <a href="#">Organics Recycling</a>
          <a href="#">Universal Waste</a>
        </div>

        <div className="footer-column">
          <h4>Materials</h4>
          <a href="#">Cardboard</a>
          <a href="#">Concrete & Drywall</a>
          <a href="#">Glass</a>
          <a href="#">Metal</a>
          <a href="#">Paper</a>
          <a href="#">Plastic</a>
          <a href="#">Wood</a>
        </div>

        <div className="footer-column">
          <h4>Sustainability Hub</h4>
          <a href="#">All Resources</a>
          <a href="#">Articles</a>
          <a href="#">Guides</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
