import React from "react";
import Hero from "../Components/Hero/Hero";
import About from "../Components/About/About";
import ServicesPreview from "../Components/ServicesPreview/ServicesPreview";
import ClientsReview from "../Components/ClientsReview/ClientsReview";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <ServicesPreview />
      <section className="portfolio-section" id="Portfolio">
        <div className="portfolio-header">
          <div className="portfolio-title">
            <p className="section-label">
              <span className="label-accent">MAKEUPBYBIMS</span> | OUR WORKS
            </p>
            <h2 className="section-heading">Portfolio</h2>
          </div>
          <a href="#Portfolio" className="view-all-link">
            VIEW ALL WORKS
          </a>
        </div>
        <div className="portfolio-grid">
          <div className="portfolio-item">
            <img src="/Images/img45.jpg" alt="Portfolio work" />
          </div>
          <div className="portfolio-item">
            <img src="/Images/img3.jpg" alt="Portfolio work" />
          </div>
          <div className="portfolio-item">
            <img src="/Images/img44.jpg" alt="Portfolio work" />
          </div>
          <div className="portfolio-item">
            <img src="/Images/img41.jpg" alt="Portfolio work" />
          </div>
          <div className="portfolio-item">
            <img src="/Images/img16.jpeg" alt="Portfolio work" />
          </div>
          <div className="portfolio-item">
            <img src="/Images/img10.jpg" alt="Portfolio work" />
          </div>
        </div>
      </section>
      <ClientsReview />
    </>
  );
};

export default Home;
