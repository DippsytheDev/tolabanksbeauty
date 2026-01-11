import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServicesPreview.css";
import { people } from "../../data";

const ServicesPreview = () => {
  const navigate = useNavigate();

  const openBooking = () => {
    navigate("/booking");
  };

  // Get minimum price for a category
  const getMinPrice = (services) => {
    if (services.length === 0) return "Contact Us";
    const prices = services
      .map((s) => s.Price)
      .map((p) => {
        // Extract first number found in price string
        const match = p.match(/\d+/);
        return match ? Number(match[0]) : null;
      })
      .filter((p) => p !== null && !isNaN(p));
    if (prices.length === 0) return "Contact Us";
    const minPrice = Math.min(...prices);
    return `From $${minPrice}`;
  };

  // Group services
  const bridalServices = people.filter((service) =>
    service.name.toLowerCase().includes("bridal session")
  );

  const nonBridalServices = people.filter((service) =>
    service.name.toLowerCase().includes("non-bridal")
  );

  // Create service cards matching the Figma design
  const serviceCards = [
    {
      id: "bridal",
      name: "Bridal Session",
      price: getMinPrice(bridalServices),
      image: bridalServices[0]?.img || "/Images/img16.jpeg",
      navigateTo: "package", // Goes to step 2 (package selection)
    },
    {
      id: "non-bridal",
      name: "Non-Bridal Session",
      price: getMinPrice(nonBridalServices),
      image: nonBridalServices[0]?.img || "/Images/img10.jpg",
      navigateTo: "package", // Goes to step 2 (package selection)
    },
    {
      id: "training",
      name: "Bridal Party",
      price: "From $230",
      image: "/Images/img1.jpg",
      navigateTo: "datetime", // Goes to step 3 (date/time selection)
    },
    {
      id: "diy",
      name: "DIY Makeup Session",
      price: "From $280",
      image: "/Images/img19.jpg",
      navigateTo: "datetime", // Goes to step 3 (date/time selection)
    },
  ];

  const handleServiceClick = (serviceCard) => {
    navigate("/booking", {
      state: {
        serviceId: serviceCard.id,
        initialStep: serviceCard.navigateTo === "package" ? 2 : 3,
      },
    });
  };

  return (
    <section className="services-preview-section" id="Services">
      <div className="services-preview-header">
        <div className="services-preview-title">
          <p className="section-label">
            <span className="label-accent">MAKEUPBYBIMS</span> | WHAT WE OFFER
          </p>
          <h2 className="section-heading">Our Services</h2>
        </div>
        <button onClick={openBooking} className="view-all-link">
          VIEW ALL SERVICES
        </button>
      </div>

      <div className="services-preview-cards-wrapper">
        <div className="services-preview-cards">
          {serviceCards.map((serviceCard) => {
            return (
              <div
                key={serviceCard.id}
                className="service-card"
                onClick={() => handleServiceClick(serviceCard)}
              >
                <div className="service-card-image">
                  <img src={serviceCard.image} alt={serviceCard.name} />
                  <div className="service-card-overlay"></div>
                </div>
                <div className="service-card-content">
                  {serviceCard.name && (
                    <h3 className="service-name">{serviceCard.name}</h3>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
