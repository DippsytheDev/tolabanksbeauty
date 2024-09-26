import React, { useState } from "react";
import "./BookCard.css";
import { people } from "../../data";
import Booking from "./Booking";

const BookCard = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const openBooking = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };
  const closeBooking = () => {
    setBookingOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <article className="booking-container">
        <h1 className="make">MAKE A BOOKING</h1>
        <ul className="second">
          {people.map((service, index) => {
            const { id, img, name, description, Duration, Price } = service;
            return (
              <li className="list-tile" key={id}>
                <img src={img} alt="dippsycan" />
                <div className="all-content">
                  <div className="content">
                    <div className="texts">
                      <h2>{name}</h2>
                    </div>
                    {description && <p className="desc">{description}</p>}
                    <div className="info">
                      <h3>{Duration}</h3>
                      <h4>{Price}</h4>
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() =>
                      openBooking({ name, description, id, Price, Duration })
                    }
                  >
                    Book Now
                  </button>
                  {bookingOpen && (
                    <Booking
                      isOpen={bookingOpen}
                      onRequestClose={closeBooking}
                      service={selectedService}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
};

export default BookCard;
