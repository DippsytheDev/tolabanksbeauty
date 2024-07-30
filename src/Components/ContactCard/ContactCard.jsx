import React from "react";
import "./ContactCard.css";

const ContactCard = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
            quas possimus, pariatur odio optio culpa accusantium consequuntur
            autem quisquam adipisci sunt quaerat iure molestiae magnam omnis
            aspernatur
          </p>
        </div>
        <div className="footer-contact">
          <h2>Contact Us</h2>
          <p>
            <i className="fas fa-map-marker-alt"></i> 123 Makeup Street, Beauty
            City, USA
          </p>
          <p>
            <i className="fas fa-phone-alt"></i> +1 234 567 890
          </p>
          <p>
            <i className="fas fa-envelope"></i> info@makeupwebsite.com
          </p>
        </div>
        <div className="footer-social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-pinterest-p"></i>
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
