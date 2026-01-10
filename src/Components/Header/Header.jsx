import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If we're not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
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
        }
      }, 100);
    } else {
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

  const handleServicesClick = (e) => {
    e.preventDefault();
    navigate("/booking");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          makeup by bims
        </Link>
        <nav className="header-nav">
          <ul className="nav-links">
            <li>
              <a href="#About" onClick={(e) => { e.preventDefault(); scrollToSection("About"); }}>
                ABOUT
              </a>
            </li>
            <li>
              <a href="/services" onClick={handleServicesClick}>
                SERVICES
              </a>
            </li>
            <li>
              <a href="#Portfolio" onClick={(e) => { e.preventDefault(); scrollToSection("Portfolio"); }}>
                PORTFOLIO
              </a>
            </li>
            <li>
              <a href="#Contact" onClick={(e) => { e.preventDefault(); scrollToSection("Contact"); }}>
                CONTACT
              </a>
            </li>
          </ul>
          <button 
            className="book-me-btn"
            onClick={() => navigate("/booking")}
          >
            BOOK ME
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

