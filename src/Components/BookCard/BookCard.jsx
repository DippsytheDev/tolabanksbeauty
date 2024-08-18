import React, { useState } from "react";
import "./BookCard.css";
import { people } from "../../data";
import Booking from "./Booking";

const BookCard = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      <article className="booking-container">
        <h1 className="make">MAKE A BOOKING</h1>
        <ul className="second">
          {people.map((make) => {
            const { id, img, name, Duration, Price } = make;
            return (
              <li className="list-tile" key={id}>
                <img src={img} alt="dippsycan" />
                <div className="all-content">
                  <div className="content">
                    <div className="texts">
                      <h2>{name}</h2>
                    </div>
                    <div className="info">
                      <h3>{Duration}</h3>
                      <h4>{Price}</h4>
                    </div>
                  </div>

                  <button className="btn" onClick={openBooking}>
                    Book Now
                  </button>
                  {bookingOpen && (
                    <Booking
                      isOpen={bookingOpen}
                      onRequestClose={closeBooking}
                      service={{ name, id, Price }}
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
