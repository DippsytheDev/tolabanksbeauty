import React from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ContactCard from "./Components/ContactCard/ContactCard";
import BookCard from "./Components/BookCard/BookCard";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  const container = useRef();

  useGSAP(() => {
    // gsap code here...
    gsap.from(".squareee", {
      scrollTrigger: {
        trigger: ".squareee",
        toggleActions: "play none none none",
      },
      stagger: 0.3,
      opacity: 0,
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
  });
  return (
    <div className="app-container" id="Home">
      <div className="container">
        <ul className="navbar">
          <li>
            <a href="#Home">Home</a>
          </li>
          <li>
            <a href="#Bookings">Bookings</a>
          </li>
          <li>
            <a href="#Portfolio">Portfolio</a>
          </li>
          <li>
            <a href="#Contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="first">
        <div className="main-img squareee">
          <img src="/Images/img21.jpg" alt="" />
        </div>
        <div className="about-me squareee">
          <h1>About Me</h1>
          <h1 className="unicode">&#9013;</h1>
          <p>
            <span className="one">Hi, I’m Bims...</span>I'm a Calgary-based
            makeup artist with over eight years of experience in the beauty
            industry, specializing in glamorous and skin-enhancing makeup for
            various occasions, including weddings, birthday parties, and other
            social events. My goal at Makeupbybims is to not only enhance
            natural beauty but also to boost individuals' confidence, surpassing
            expectations and setting a new benchmark in the makeup industry.
          </p>
        </div>

        <div className="services squareee">
          <div className="service-heading">
            <h1>SERVICES</h1>
          </div>
          <h1 className="unicode">&#9013;</h1>
          <ul>
            <li>Bridal Makeup</li>
            <li>Non-Bridal Makeup</li>
            <li>1on1 Master Class</li>
            <li>DIY Makeup Class</li>
          </ul>
        </div>
        <div className="image-grid squareee ">
          <img src="/Images/img19.jpg" alt="" />
        </div>
        <div className="hide clients squareee">
          <div className="clients-heading">
            <h1>NON-MAKEUP</h1>
          </div>
          <h1 className="unicode">&#9013;</h1>
          <ul>
            <li>Cornrows</li>
            <li>Semi-Permanent Makeup</li>
          </ul>
        </div>
        <div className="image-grids squareee">
          <img src="/Images/img20.jpg" alt="" />
        </div>
      </div>
      <div className="bookCard__container" id="Bookings">
        <BookCard />
      </div>
      <section className="Portfolio" id="Portfolio">
        <h1 className="center port topic-text">PORTFOLIO</h1>
        <div className="third">
          <div className="item square">
            <img src="/Images/img10.jpg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img2.jpg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img3.jpg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img16.jpeg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img5.jpg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img14.jpg" alt="" />
          </div>
          <div className="item square">
            <img src="/Images/img1.jpg" alt="" />
          </div>
        </div>
      </section>

      <div id="Contact">
        <ContactCard />
      </div>
    </div>
  );
}

export default App;
