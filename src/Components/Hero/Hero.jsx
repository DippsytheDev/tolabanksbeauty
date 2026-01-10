import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
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
  };

  return (
    <section className="hero-section" id="Home">
      <div className="hero-background">
        <img src="/Images/img21.jpg" alt="Bims - Professional Makeup Artist" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <p className="hero-label">PROFESSIONAL MAKEUP ARTIST</p>
        <h1 className="hero-heading">Hi there, I am Bims</h1>
        <div className="hero-buttons">
          <button 
            className="hero-btn-primary"
            onClick={() => navigate("/booking")}
          >
            BOOK A SESSION
          </button>
          <button 
            className="hero-btn-secondary"
            onClick={() => scrollToSection("Portfolio")}
          >
            VIEW PORTFOLIO
          </button>
        </div>
        <div className="hero-social">
          <a href="https://www.tiktok.com/@makeupbybims" target="_blank" rel="noopener noreferrer">
            TIKTOK
          </a>
          <a href="https://www.instagram.com/makeupbybims" target="_blank" rel="noopener noreferrer">
            INSTAGRAM
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

