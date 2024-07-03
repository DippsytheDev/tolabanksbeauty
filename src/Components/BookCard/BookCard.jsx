import React from "react";
import "./BookCard.css";
import { people } from "../../data";

function BookCard() {
  return (
    <>
      <article>
        <h1>BOOK A SERVICE</h1>
        <ul className="second">
          {people.map((make) => {
            const { id, img, name, Duration, Price } = make;
            return (
              <li key={id}>
                <img src={img} alt="dippsycan" />
                <div>
                  <h2>{name}</h2>
                  <h3>{Duration}</h3>
                  <h4>{Price}</h4>
                </div>
                <button className="btn">Book Now</button>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
}

export default BookCard;
