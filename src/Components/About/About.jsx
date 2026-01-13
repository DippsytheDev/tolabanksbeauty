import React from "react";
import "./About.css";

const About = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="about-section" id="About">
      <div className="about-header">
        <p className="section-label">
          <span className="label-accent">MAKEUPBYBIMS</span> | THE ARTIST
        </p>
        <h2 className="section-heading">About me</h2>
      </div>

      <div className="about-content">
        <div className="about-text-left">
          <p className="about-description">
            I'm a Calgary-based makeup artist with over eight years of
            experience in the beauty industry, specializing in glamorous and
            skin-enhancing makeup for various occasions including weddings,
            birthday parties,photo shoots,commercials and other special events.
          </p>
        </div>

        <div className="about-image-right">
          <img src="/Images/img46.jpg" alt="Bims - Makeup Artist" />
        </div>
      </div>

      <div className="about-content-bottom">
        <div className="about-text-right">
          <p className="about-description">
            My goal at MakeupByBims is not only to enhance natural beauty but to
            also boost individual confidence and morale, surpassing expectations
            and setting a new benchmark in the make up industry.
          </p>
          <button
            className="about-portfolio-btn"
            onClick={() => scrollToSection("Portfolio")}
          >
            VIEW PORTFOLIO
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
