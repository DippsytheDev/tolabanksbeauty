import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ContactCard.css";

const ContactCard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll with retry mechanism
      const attemptScroll = (attempts = 0) => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          } else if (attempts < 5) {
            // Retry up to 5 times with increasing delay
            attemptScroll(attempts + 1);
          }
        }, 100 + attempts * 100);
      };
      attemptScroll();
    } else {
      // We're on the home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <footer className="footer" id="Contact">
      <div className="footer-watermark">makeupbybims</div>
      <div className="footer-container">
        <div className="footer-about">
          <h2 className="footer-logo">makeup by bims</h2>
          <p className="footer-description">
            Creating stunning personalized looks for special occasions, brides and creative projects. Let's help you elevate your beauty!
          </p>
        </div>
        <div className="footer-links">
          <h3 className="footer-links-title">QUICK LINKS</h3>
          <ul className="footer-links-list">
            <li>
              <a href="#About" onClick={(e) => { e.preventDefault(); scrollToSection("About"); }}>
                About
              </a>
            </li>
            <li>
              <a href="/booking" onClick={(e) => { e.preventDefault(); navigate("/booking"); }}>
                Services
              </a>
            </li>
            <li>
              <a href="#Portfolio" onClick={(e) => { e.preventDefault(); scrollToSection("Portfolio"); }}>
                Portfolio
              </a>
            </li>
            <li>
              <a href="#Contact" onClick={(e) => { e.preventDefault(); scrollToSection("Contact"); }}>
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-contact">
          <h3 className="footer-contact-title">Contact</h3>
          <ul className="footer-contact-list">
            <li>
              <a href="mailto:Bimstudios@yahoo.com">email</a>
            </li>
            <li>
              <a href="https://wa.me/14035963770">whatsapp</a>
            </li>
            <li>
              <a href="https://www.instagram.com/makeupbybims" target="_blank" rel="noopener noreferrer">
                instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-bottom">
        <p>&copy; 2026. Makeup By Bims. all rights reserved.</p>
      </div>
    </footer>
  );
};

export default ContactCard;
