import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/HeroSection.scss";
import heroImg1 from "../image/hero1.jpg";
import heroImg2 from "../image/hero2.jpg";
import heroImg3 from "../image/hero3.jpg";
import heroImg4 from "../image/hero4.jpg";

const slides = [
  {
    image: heroImg1,
    title: "Explore Sri Lanka with Comfort",
    desc: "Book premium vehicles for your journey today!",
  },
  {
    image: heroImg2,
    title: "Adventure Awaits",
    desc: "From beaches to mountains — travel with ease!",
  },
  {
    image: heroImg3,
    title: "Your Trip, Your Way",
    desc: "Luxury, budget, or family vehicles — all in one place.",
  },
  {
    image: heroImg4,
    title: "Safety and Reliability",
    desc: "Trust and explore with LankaTour's reliable services.",
  },
];

function HeroSection() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBookNow = () => {
    navigate("/booking"); // ✅ go to booking page
  };

  return (
    <>
      <div
        className="hero-container"
        style={{ backgroundImage: `url(${slides[index].image})` }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">{slides[index].title}</h1>
          <p className="hero-desc">{slides[index].desc}</p>

          <Button
            className="hero-book-btn"
            variant="danger"
            size="lg"
            onClick={handleBookNow} // ✅ click handler
          >
            Book Now
          </Button>
        </div>
      </div>
      <div className="hero-animated-text">
        <span>Discover • Explore • Travel • Experience Sri Lanka With Cey <span style={{ color: "#F2B426" }}>Trips</span></span>
      </div>
    </>
  );
}

export default HeroSection;
