import React from "react";
import { Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Components/Header/Header";
import ContactCard from "./Components/ContactCard/ContactCard";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import "./App.css";

const isMaintenanceMode = false;

function App() {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    // Fade in animations for portfolio images
    gsap.from(".portfolio-item", {
      scrollTrigger: {
        trigger: ".portfolio-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      stagger: 0.15,
      opacity: 0,
      duration: 0.8,
      y: 50,
      ease: "power2.out",
    });

    // Fade in for testimonial card
    gsap.from(".testimonial-card", {
      scrollTrigger: {
        trigger: ".testimonial-card",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      duration: 1,
      y: 30,
      ease: "power2.out",
    });
  });

  return (
    <div className="app-container">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
      <Routes>
        <Route path="/booking" element={null} />
        <Route path="*" element={<ContactCard />} />
      </Routes>
    </div>
  );
}

export default App;
