import React, { useState } from "react";
import "./BookCard.css";
import { people } from "../../data";
import Booking from "./Booking";

const BookCard = ({ id, img, name, Duration, Price }) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      <article>
        <h1 className="center">BOOK A SERVICE</h1>
        <ul className="second">
          {people.map((make) => {
            const { id, img, name, Duration, Price } = make;
            return (
              <li key={id}>
                <img src={img} alt="dippsycan" />
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
                    service={{ name, id }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
};

export default BookCard;
