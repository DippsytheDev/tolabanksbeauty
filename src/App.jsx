import React from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import ContactCard from "./Components/ContactCard/ContactCard";
import BookCard from "./Components/BookCard/BookCard";
import img1 from "/book1.jpg";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  const container = useRef();

  useGSAP(
    () => {
      // gsap code here...
      gsap.from(".squareee", {
        scrollTrigger: {
          trigger: ".squareee",
          toggleActions: "play none none none",
        },
        stagger: 0.3,
        opacity: 0,
        bounce: 0.5,
        duration: 1.2,
        ease: "bounce",
        x: 200,
      });
      gsap.from(".squaree", {
        scrollTrigger: {
          trigger: ".squaree",
          toggleActions: "play none none none",
        },
        stagger: 0.25,
        opacity: 0,
        duration: 1,
        x: 200,
      });
      gsap.from(".square", {
        scrollTrigger: {
          trigger: ".square",
          toggleActions: "play none none none",
        },
        stagger: 0.25,
        opacity: 0,
        duration: 1,
        y: 150,
      });
    }
    // { scope: container }
  );
  return (
    <div className="app-container">
      <div className="container">
        <ul className="navbar">
          <li>Home</li>
          <li>Portfolio</li>
          <li>Bookings</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className="first">
        <div className="intro squareee">
          <h1>CALGARY</h1>
          <h1 className="makeup">MAKEUP</h1>
          <h1>ARTIST</h1>
        </div>
        <div className="main-img squareee">
          <img src={img1} alt="" />
        </div>
        <div className="about-me squareee">
          <h1>About Me</h1>
          <h1 className="unicode">&#9660;</h1>
          <p>
            Calgary Makeup Artist Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Natus quasi commodi voluptas amet dolores dolorem,
            rerum pariatur. Unde, neque laudantium reprehenderit id, corporis,
            cum quaerat nostrum ratione vel quibusdam consequuntur.
          </p>
        </div>

        <div className="services squareee">
          <h1>SERVICES</h1>
          <h1 className="unicode">&#9660;</h1>
          <ul>
            <li>Bridal Makeup</li>
            <li>Group Makeup</li>
            <li>Events Makeup</li>
            <li>Theatre Makeup</li>
            <li>Theatre Makeup</li>
            <li>Theatre Makeup</li>
          </ul>
        </div>
        <div className="image-grid squareee ">
          <img src={img1} alt="" />
        </div>
        <div className="hide clients squareee">
          <h1>CLIENTS</h1>
          <h1 className="unicode">&#9660;</h1>
          <ul>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
            <li>Ad Works</li>
          </ul>
        </div>
        <div className="image-grids squareee">
          <img src={img1} alt="" />
        </div>
      </div>
      <div className="bookCard__container">
        <BookCard />
      </div>
      <section className="third">
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
        <div className="item square">
          <img src={img1} alt="" />
        </div>
      </section>

      <div>
        <ContactCard />
      </div>
    </div>
  );
}

export default App;
