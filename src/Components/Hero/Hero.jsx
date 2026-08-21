import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section" id="Home">
      <div className="hero-background">
        <img src="/Images/img21.jpg" alt="Bims - Professional Makeup Artist" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-heading">Hi there, I am Bims</h1>
        <div className="hero-buttons">
          <button
            className="hero-btn-primary"
            onClick={() => navigate("/booking")}
          >
            BOOK A SESSION
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
