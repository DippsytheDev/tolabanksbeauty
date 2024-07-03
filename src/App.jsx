import React from "react";

import { useState } from "react";
import ContactCard from "./Components/ContactCard/ContactCard";
import BookCard from "./Components/BookCard/BookCard";

import { people } from "./data";
function App() {
  return (
    <>
      <ul className="container">
        <li>Home</li>
        <li>Portfolio</li>
        <li>Bookings</li>
        <li>Contact</li>
      </ul>
      <section className="first">
        <div className="box header">
          <p>CALGARY</p>

          <p className="makeup">MAKEUP</p>
          <p>ARTIST</p>
        </div>
        <div className="box">2</div>
        <div className="box">
          <h1>About Me</h1>
          <p>
            Calgary Makeup Artist Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Natus quasi commodi voluptas amet dolores dolorem,
            rerum pariatur. Unde, neque laudantium reprehenderit id, corporis,
            cum quaerat nostrum ratione vel quibusdam consequuntur.
          </p>
        </div>
        <div className="box">
          <h1>SERVICES</h1>
          <h2 className="unicode">&#709;</h2>
          <ul>
            <li>Bridal Makeup</li>
            <li>Group Makeup</li>
            <li>Events Makeup</li>
            <li>Theatre Makeup</li>
          </ul>
        </div>
        <div className="box">5</div>
        <div className="box">6</div>
        <div className="box">
          <h1>CLIENTS</h1>
          <h2 className="unicode">&#709;</h2>
          <ul>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
          </ul>
        </div>
      </section>
      <div>
        <BookCard />
      </div>

      <section className="third">
        <div className="boxer">1</div>
        <div className="boxer">2</div>
        <div className="boxer">3</div>
        <div className="boxer">4</div>
        <div className="boxer">5</div>
        <div className="boxer">6</div>
        <div className="boxer">7</div>
        <div className="boxer">8</div>
        <div className="boxer">9</div>
        <div className="boxer">10</div>
        <div className="boxer">12</div>
      </section>
      <section className="fourth">
        <ContactCard />
        <ContactCard />
        <ContactCard />
      </section>
    </>
  );
}

export default App;
