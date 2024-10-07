import React from "react";
import "./ContactCard.css";

const ContactCard = () => {
  return (
    <footer className="footer squareee">
      <div className="footer-container">
        <div className="footer-about">
          <h2>About Us</h2>
          <p>
            Welcome to Makeup by Bims where beauty meets artistry.With a passion
            for creativity and a keen eye for detail, We specialize in enhancing
            your natural beauty for every occasion.Whether you are preparing for
            a wedding,a special event,or a photoshoot,our expert makeup services
            are tailored to meet your unique style and personality.
          </p>
        </div>
        <div className="footer-contact">
          <h2>Contact Us</h2>
          <p>
            <i className="fas fa-map-marker-alt"></i> Calgary, Alberta
          </p>
          <p>
            <i className="fas fa-phone-alt"></i> +1403 596 3770
          </p>
          <p>
            <i className="fas fa-envelope"></i> Bimstudios@yahoo.com
          </p>
        </div>
        <div className="footer-social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/makeupbybims?igsh=MTVnd3EwemxjNGQwaw%3D%3D&utm_source=qr"
              className="social-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="mailto:Bimstudios@yahoo.com" className="social-icon">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Makeup Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default ContactCard;
