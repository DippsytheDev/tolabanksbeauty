import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllServices.css";
import { people } from "../../data";

const AllServices = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const openBooking = (service) => {
    // Navigate to booking page
    navigate("/booking");
  };

  // Group services by category
  const bridalServices = people.filter(service => 
    service.name.toLowerCase().includes("bridal session")
  );
  
  const nonBridalServices = people.filter(service => 
    service.name.toLowerCase().includes("non-bridal")
  );
  
  const civilWeddingServices = people.filter(service => 
    service.name.toLowerCase().includes("civil wedding")
  );
  
  const bridalTrainService = people.find(service => 
    service.name.toLowerCase().includes("bridal train")
  );

  const getFilteredServices = () => {
    switch (activeFilter) {
      case "BRIDAL SESSION":
        return bridalServices;
      case "NON-BRIDAL SESSION":
        return nonBridalServices;
      case "CIVIL WEDDING":
        return civilWeddingServices;
      default:
        return people;
    }
  };

  const filteredServices = getFilteredServices();

  // Group services for display
  const bridalGroup = bridalServices;
  const nonBridalGroup = nonBridalServices;
  const civilGroup = civilWeddingServices;

  const renderServiceGroup = (services, serviceNumber, title, image, imageOnLeft = true) => {
    if (activeFilter !== "ALL" && !filteredServices.some(s => services.includes(s))) {
      return null;
    }

    return (
      <div key={serviceNumber} className="service-group">
        <div className={`service-group-content ${imageOnLeft ? 'image-left' : 'image-right'}`}>
          {imageOnLeft && (
            <div className="service-group-image">
              <img src={image} alt={title} />
            </div>
          )}
          
          <div className="service-group-details">
            <div className="service-group-header">
              <div className="service-group-title">
                <p className="service-number">SERVICE {serviceNumber}</p>
                <h3 className="service-group-name">{title}</h3>
              </div>
              <button 
                className="service-book-btn"
                onClick={() => {
                  // Open booking for first service in group
                  if (services.length > 0) {
                    openBooking(services[0]);
                  }
                }}
              >
                BOOK A SESSION
              </button>
            </div>

            <div className="service-packages">
              {services.map((service) => {
                // Extract package name from service name
                let packageName = service.name;
                if (service.name.includes("(")) {
                  packageName = service.name.match(/\(([^)]+)\)/)?.[1] || service.name;
                } else if (service.name.includes("BRIDAL SESSION")) {
                  packageName = service.name.replace("BRIDAL SESSION", "").trim();
                } else if (service.name.includes("NON-BRIDAL SESSION")) {
                  packageName = service.name.replace("NON-BRIDAL SESSION", "").trim();
                }
                
                return (
                  <div key={service.id} className="service-package-card">
                    <div className="package-header">
                      <h4 className="package-name">{packageName || service.name}</h4>
                      <p className="package-price">{service.Price}</p>
                    </div>
                    {service.description && (
                      <p className="package-description">{service.description}</p>
                    )}
                    <p className="package-duration">{service.Duration?.toUpperCase()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {!imageOnLeft && (
            <div className="service-group-image">
              <img src={image} alt={title} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="all-services-section" id="AllServices">
      <div className="all-services-header">
        <p className="section-label">
          <span className="label-accent">MAKEUPBYBIMS</span> | WHAT WE OFFER
        </p>
        <h2 className="section-heading">Our Services</h2>
      </div>

      <div className="services-filter">
        <button
          className={`filter-btn ${activeFilter === "ALL" ? "active" : ""}`}
          onClick={() => setActiveFilter("ALL")}
        >
          ALL
        </button>
        <button
          className={`filter-btn ${activeFilter === "BRIDAL SESSION" ? "active" : ""}`}
          onClick={() => setActiveFilter("BRIDAL SESSION")}
        >
          BRIDAL SESSION
        </button>
        <button
          className={`filter-btn ${activeFilter === "NON-BRIDAL SESSION" ? "active" : ""}`}
          onClick={() => setActiveFilter("NON-BRIDAL SESSION")}
        >
          NON-BRIDAL SESSION
        </button>
        <button
          className={`filter-btn ${activeFilter === "CIVIL WEDDING" ? "active" : ""}`}
          onClick={() => setActiveFilter("CIVIL WEDDING")}
        >
          CIVIL WEDDING
        </button>
      </div>

      <div className="all-services-content">
        {activeFilter === "ALL" || activeFilter === "BRIDAL SESSION" ? (
          renderServiceGroup(
            bridalGroup,
            "01",
            "Bridal Session",
            bridalGroup[0]?.img || "/Images/img16.jpeg",
            true
          )
        ) : null}

        {activeFilter === "ALL" || activeFilter === "NON-BRIDAL SESSION" ? (
          renderServiceGroup(
            nonBridalGroup,
            "02",
            "Non-Bridal Session",
            nonBridalGroup[0]?.img || "/Images/img10.jpg",
            false
          )
        ) : null}

        {activeFilter === "ALL" || activeFilter === "CIVIL WEDDING" ? (
          renderServiceGroup(
            civilGroup,
            "03",
            "Civil Wedding",
            civilGroup[0]?.img || "/Images/img14.jpg",
            true
          )
        ) : null}

        {activeFilter === "ALL" && bridalTrainService && (
          <div className="service-group">
            <div className="service-group-content image-left">
              <div className="service-group-details">
                <div className="service-group-header">
                  <div className="service-group-title">
                    <p className="service-number">SERVICE 04</p>
                    <h3 className="service-group-name">Bridal Train Makeup</h3>
                  </div>
                  <button 
                    className="service-book-btn"
                    onClick={() => openBooking(bridalTrainService)}
                  >
                    BOOK A SESSION
                  </button>
                </div>
                <div className="service-packages">
                  <div className="service-package-card">
                    <div className="package-header">
                      <h4 className="package-name">{bridalTrainService.name}</h4>
                      <p className="package-price">{bridalTrainService.Price}</p>
                    </div>
                    {bridalTrainService.description && (
                      <p className="package-description">{bridalTrainService.description}</p>
                    )}
                    <p className="package-duration">{bridalTrainService.Duration?.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllServices;
