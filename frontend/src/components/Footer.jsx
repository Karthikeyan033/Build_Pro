
import React from 'react';
import { FaInstagram, FaLinkedinIn, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-section">
          <h3>🏗️ BuildPro</h3>
          <p>
            Professional construction planning and cost estimation platform. We help you
            build your dreams with precision and expertise.
          </p>

          <div className="social-links">
            {/* Replace href values with your actual profile links */}
            <a
              href="https://www.instagram.com/kettavan_karthi_666?igsh=MjZscDByc3dyOTNp"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/in/karthikeyan-s-ab4952349?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://youtube.com/@bharathi1110karthikeyan?si=LGnHZO5BbEcQQG5b"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              <FaYoutube />
            </a>

            <a
              href="https://github.com/Karthikeyan033"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3>Services</h3>
          <a href="#">Construction Planning</a>
          <a href="#">Cost Estimation</a>
          <a href="#">Project Management</a>
          <a href="#">Material Calculator</a>
          <a href="#">3D Visualization</a>
          <a href="#">Permit Assistance</a>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h3>Resources</h3>
          <a href="#">Documentation</a>
          <a href="#">Video Tutorials</a>
          <a href="#">Cost Guides</a>
          <a href="#">Building Codes</a>
          <a href="#">FAQ</a>
          <a href="#">Support Center</a>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Our Team</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2025 BuildPro. All rights reserved. | Professional Construction Planning
          Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
