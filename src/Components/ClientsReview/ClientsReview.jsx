import React from "react";
import "./ClientsReview.css";

const ClientsReview = () => {
  return (
    <section className="clients-review-section">
      <div className="clients-review-header">
        <p className="section-label">
          <span className="label-accent">MAKEUPBYBIMS</span> | WHAT OUR CLIENTS ARE SAYING
        </p>
        <h2 className="section-heading">Clients Review</h2>
      </div>

      <div className="testimonial-card">
        <div className="testimonial-quote">"</div>
        <p className="testimonial-text">
          Bims is absolutely amazing! She understood exactly what I wanted for my wedding day and executed it perfectly. My makeup lasted the entire day and night, and I felt like the most beautiful bride. Highly recommend!
        </p>
        <div className="testimonial-author">
          <p className="author-name">ADAEZE OKONKWO</p>
          <p className="author-role">BRIDE</p>
        </div>
        <div className="testimonial-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default ClientsReview;

